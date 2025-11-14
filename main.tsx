import { hash, verify } from "@felix/bcrypt";
import { sValidator } from "@hono/standard-validator";
import { nanoid } from "@sitnik/nanoid";
import { Hono } from "hono";
import { addConstraint } from "./logic/addConstraint.ts";
import { confirmDraw } from "./logic/confirmDraw.ts";
import { deleteConstraint } from "./logic/deleteConstraint.ts";
import { getProjectWithUsers } from "./logic/getProjectWithUsers.ts";
import {
  adminSchema,
  createProjectSchema,
  createUserSchema,
  participantEditSchema,
  resultsSchema,
  tirageAuSortSchema,
} from "./logic/schemas.tsx";
import { TProject, TUser } from "./logic/types.ts";
import { AddUser } from "./views/AddUser.tsx";
import { Admin } from "./views/Admin.tsx";
import { ConfirmDraw } from "./views/ConfirmDraw.tsx";
import { Home } from "./views/Home.tsx";
import { NotFound } from "./views/NotFound.tsx";
import { ParticipantEdit } from "./views/ParticipantEdit.tsx";
import { Project } from "./views/Project.tsx";
import { Results } from "./views/Results.tsx";

const kv = await Deno.openKv();

// Helper function to verify participant password (user password OR project password OR admin password)
async function verifyParticipantPassword(
  password: string,
  user: TUser,
  project: TProject
): Promise<boolean> {
  // Check user password
  if (await verify(password, user.passwordHash)) {
    return true;
  }

  // Check project password if it exists
  if (project.passwordHash && await verify(password, project.passwordHash)) {
    return true;
  }

  // Check admin password if it exists
  const adminPassword = Deno.env.get("ADMIN_PASSWORD");
  if (adminPassword && password === adminPassword) {
    return true;
  }

  return false;
}

const app = new Hono();

app.get("/", (c) => c.html(<Home />));

app.post("/", sValidator("form", createProjectSchema), async (c) => {
  const { name, enablePassword, password } = c.req.valid("form");
  const newProject: TProject = {
    id: nanoid(14),
    name,
    assignments: null,
    createdAt: Date.now(),
  };
  // Only set password if checkbox is checked and password is provided
  if (enablePassword === "true" && password && password.trim() !== "") {
    newProject.passwordHash = await hash(password);
  }
  await kv.set(["project", newProject.id], newProject);
  return c.redirect(`/${newProject.id}`);
});

app.get("/admin", (c) => {
  return c.html(<Admin />);
});

app.post("/admin", sValidator("form", adminSchema), async (c) => {
  const { password } = c.req.valid("form");
  const adminPassword = Deno.env.get("ADMIN_PASSWORD");
  
  // If env variable is missing or password doesn't match, show invalid password
  if (!adminPassword || password !== adminPassword) {
    return c.html(<Admin invalidPassword={true} />);
  }
  
  // Fetch all projects from KV
  const projects: TProject[] = [];
  const entries = kv.list<TProject>({ prefix: ["project"] });
  
  for await (const entry of entries) {
    // Only include top-level project entries, not nested user entries
    if (entry.key.length === 2) {
      projects.push(entry.value);
    }
  }
  
  // Sort projects by createdAt (newest first), handling projects without createdAt
  projects.sort((a, b) => {
    const aTime = a.createdAt ?? 0;
    const bTime = b.createdAt ?? 0;
    return bTime - aTime;
  });
  
  return c.html(<Admin projects={projects} />);
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

app.get("/:projectId/participant/:participantId", async (c) => {
  const projectId = c.req.param("projectId");
  const participantId = c.req.param("participantId");
  
  const result = await getProjectWithUsers(kv, projectId);
  if (!result) {
    return c.html(<NotFound />, 404);
  }

  const user = result.users.find((u) => u.id === participantId);
  if (!user) {
    return c.html(<NotFound />, 404);
  }

  return c.html(<ParticipantEdit project={result.project} user={user} />);
});

app.post(
  "/:projectId/participant/:participantId",
  sValidator("form", participantEditSchema),
  async (c) => {
    const projectId = c.req.param("projectId");
    const participantId = c.req.param("participantId");
    const data = c.req.valid("form");

    const result = await getProjectWithUsers(kv, projectId);
    if (!result) {
      return c.html(<NotFound />, 404);
    }

    const { project, users } = result;
    const user = users.find((u) => u.id === participantId);
    if (!user) {
      return c.html(<NotFound />, 404);
    }

    // Handle unlock action
    if (data.action === "unlockParticipant") {
      const { password } = data;

      const isValid = await verifyParticipantPassword(password, user, project);

      if (!isValid) {
        return c.html(
          <ParticipantEdit
            project={project}
            user={user}
            invalidPassword={true}
          />
        );
      }

      // Password is correct, redirect with password in URL query
      return c.html(
        <ParticipantEdit
          project={project}
          user={user}
          unlockedPassword={password}
        />
      );
    }

    // For all other actions, verify password first
    const { password } = data;
    const isValid = await verifyParticipantPassword(password, user, project);

    if (!isValid) {
      return c.html(
        <ParticipantEdit
          project={project}
          user={user}
          invalidPassword={true}
        />
      );
    }

    // Handle update hint
    if (data.action === "updateHint") {
      const { hint } = data;
      const updatedUser: TUser = {
        ...user,
        hint,
      };
      await kv.set(["project", projectId, "user", participantId], updatedUser);
      
      return c.html(
        <ParticipantEdit
          project={project}
          user={updatedUser}
          unlockedPassword={password}
          updateSuccess="Indice mis à jour avec succès"
        />
      );
    }

    // Handle update password
    if (data.action === "updatePassword") {
      const { newPassword } = data;
      const updatedUser: TUser = {
        ...user,
        passwordHash: await hash(newPassword),
      };
      await kv.set(["project", projectId, "user", participantId], updatedUser);
      
      return c.html(
        <ParticipantEdit
          project={project}
          user={updatedUser}
          unlockedPassword={newPassword}
          updateSuccess="Mot de passe mis à jour avec succès"
        />
      );
    }

    // Handle delete user
    if (data.action === "deleteUser") {
      // Check if draw has already been done
      if (project.assignments !== null) {
        return c.html(
          <ParticipantEdit
            project={project}
            user={user}
            unlockedPassword={password}
            error="Impossible de supprimer un participant après le tirage au sort."
          />
        );
      }

      await kv.delete(["project", projectId, "user", participantId]);
      return c.redirect(`/${projectId}`);
    }

    return c.html(<NotFound />, 404);
  }
);

app.notFound((c) => c.html(<NotFound />, 404));

Deno.serve(app.fetch);
