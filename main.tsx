import { hash, verify } from "@felix/bcrypt";
import { sValidator } from "@hono/standard-validator";
import { nanoid } from "@sitnik/nanoid";
import { Hono } from "hono";
import { addConstraint } from "./logic/addConstraint.ts";
import { confirmDraw } from "./logic/confirmDraw.ts";
import { deleteConstraint } from "./logic/deleteConstraint.ts";
import { getProjectWithUsers } from "./logic/getProjectWithUsers.ts";
import {
  createProjectSchema,
  createUserSchema,
  resultsSchema,
  tirageAuSortSchema,
} from "./logic/schemas.tsx";
import { TProject, TUser } from "./logic/types.ts";
import { AddUser } from "./views/AddUser.tsx";
import { ConfirmDraw } from "./views/ConfirmDraw.tsx";
import { Home } from "./views/Home.tsx";
import { NotFound } from "./views/NotFound.tsx";
import { Project } from "./views/Project.tsx";
import { Results } from "./views/Results.tsx";

const kv = await Deno.openKv();

const app = new Hono();

app.get("/", (c) => c.html(<Home />));

app.post("/", sValidator("form", createProjectSchema), async (c) => {
  const { name, password } = c.req.valid("form");
  const newProject: TProject = {
    id: nanoid(14),
    name,
    assignments: null,
  };
  if (password && password.trim() !== "") {
    newProject.passwordHash = await hash(password);
  }
  await kv.set(["project", newProject.id], newProject);
  return c.redirect(`/${newProject.id}`);
});

app.get("/:projectId", async (c) => {
  const projectId = c.req.param("projectId");
  const result = await getProjectWithUsers(kv, projectId);
  if (!result) {
    return c.html(<NotFound />, 404);
  }

  return c.html(<Project project={result.project} users={result.users} />);
});

app.get("/:projectId/nouveau-participant", async (c) => {
  const projectId = c.req.param("projectId");
  const project = await kv.get<TProject>(["project", projectId]);
  if (!project.value) {
    return c.html(<NotFound />, 404);
  }
  return c.html(<AddUser project={project.value} />);
});

app.post(
  "/:projectId/nouveau-participant",
  sValidator("form", createUserSchema),
  async (c) => {
    const { name, hint, password } = c.req.valid("form");
    const projectId = c.req.param("projectId");
    const project = await kv.get<TProject>(["project", projectId]);
    if (!project.value) {
      return c.html(<NotFound />, 404);
    }
    // Check if draw has already been done
    if (project.value.assignments !== null) {
      return c.html(
        <AddUser
          project={project.value}
          error="Impossible d'ajouter un participant après le tirage au sort."
        />,
        400
      );
    }
    const newUser: TUser = {
      id: nanoid(14),
      name,
      hint,
      passwordHash: await hash(password),
    };
    await kv.set(["project", projectId, "user", newUser.id], newUser);
    return c.redirect(`/${projectId}`);
  }
);

app.get("/:projectId/tirage-au-sort", async (c) => {
  const projectId = c.req.param("projectId");
  const result = await getProjectWithUsers(kv, projectId);
  if (!result) {
    return c.html(<NotFound />, 404);
  }

  return c.html(<ConfirmDraw project={result.project} users={result.users} />);
});

app.post(
  "/:projectId/tirage-au-sort",
  sValidator("form", tirageAuSortSchema),
  async (c) => {
    const projectId = c.req.param("projectId");
    const result = await getProjectWithUsers(kv, projectId);
    if (!result) {
      return c.html(<NotFound />, 404);
    }

    const { project, users } = result;
    const data = c.req.valid("form");

    // Handle unlock action
    if (data.action === "unlock") {
      const { password } = data;
      
      // Verify password
      if (!project.passwordHash || !(await verify(password, project.passwordHash))) {
        return c.html(
          <ConfirmDraw
            project={project}
            users={users}
            invalidPassword={true}
          />
        );
      }

      // Password is correct, redirect with password in URL query
      return c.html(
        <ConfirmDraw
          project={project}
          users={users}
          unlockedPassword={password}
        />
      );
    }

    // Handle adding constraint
    if (data.action === "addConstraint") {
      const { left, right, kind, password } = data;
      
      // Verify password if project is protected
      if (project.passwordHash) {
        if (!password || !(await verify(password, project.passwordHash))) {
          return c.html(
            <ConfirmDraw
              project={project}
              users={users}
              constraintError="Mot de passe incorrect"
            />
          );
        }
      }

      const addResult = addConstraint(project, { left, right, kind });

      if (!addResult.success) {
        return c.html(
          <ConfirmDraw
            project={project}
            users={users}
            constraintError={addResult.error}
            unlockedPassword={password}
          />
        );
      }

      await kv.set(["project", projectId], addResult.updatedProject);
      
      // Preserve unlocked state by passing password
      return c.html(
        <ConfirmDraw
          project={addResult.updatedProject}
          users={users}
          unlockedPassword={password}
        />
      );
    }

    // Handle deleting constraint
    if (data.action === "deleteConstraint") {
      const { index, password } = data;
      
      // Verify password if project is protected
      if (project.passwordHash) {
        if (!password || !(await verify(password, project.passwordHash))) {
          return c.html(
            <ConfirmDraw
              project={project}
              users={users}
              constraintError="Mot de passe incorrect"
            />
          );
        }
      }

      const deleteResult = deleteConstraint(project, { index });

      if (!deleteResult.success) {
        return c.html(
          <ConfirmDraw
            project={project}
            users={users}
            constraintError={deleteResult.error}
            unlockedPassword={password}
          />
        );
      }

      await kv.set(["project", projectId], deleteResult.updatedProject);
      
      // Preserve unlocked state by passing password
      return c.html(
        <ConfirmDraw
          project={deleteResult.updatedProject}
          users={users}
          unlockedPassword={password}
        />
      );
    }

    // Handle confirm draw
    if (data.action === "confirmDraw") {
      const { password } = data;
      const drawResult = await confirmDraw(project, users, { password });

      if (!drawResult.success) {
        return c.html(
          <ConfirmDraw
            project={project}
            users={users}
            invalidPassword={drawResult.invalidPassword}
            drawError={drawResult.drawError}
            unlockedPassword={password}
          />
        );
      }

      await kv.set(["project", projectId], drawResult.updatedProject);
      return c.redirect(`/${projectId}`);
    }

    return c.html(<NotFound />, 404);
  }
);

app.get("/:projectId/resultats", async (c) => {
  const projectId = c.req.param("projectId");
  const result = await getProjectWithUsers(kv, projectId);
  if (!result) {
    return c.html(<NotFound />, 404);
  }

  return c.html(<Results project={result.project} users={result.users} />);
});

app.post(
  "/:projectId/resultats",
  sValidator("form", resultsSchema),
  async (c) => {
    const { userId, password } = c.req.valid("form");
    const projectId = c.req.param("projectId");
    const result = await getProjectWithUsers(kv, projectId);
    if (!result) {
      return c.html(<NotFound />, 404);
    }

    const { project, users } = result;
    const user = users.find((u) => u.id === userId);
    const userAssignments = project.assignments?.find(
      (a) => a.from === userId
    );
    const toUser = users.find((u) => u.id === userAssignments?.to);

    if (!user || !toUser) {
      return c.html(
        <Results project={project} users={users} invalidPassword />
      );
    }
    if (!(await verify(password, user.passwordHash))) {
      return c.html(
        <Results project={project} users={users} invalidPassword />
      );
    }

    return c.html(
      <Results
        project={project}
        users={users}
        assignment={{ from: user, to: toUser }}
      />
    );
  }
);

app.notFound((c) => c.html(<NotFound />, 404));

Deno.serve(app.fetch);
