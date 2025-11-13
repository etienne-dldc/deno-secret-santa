import { hash, verify } from "@felix/bcrypt";
import { sValidator } from "@hono/standard-validator";
import { nanoid } from "@sitnik/nanoid";
import { Hono } from "hono";
import {
  createProjectSchema,
  createUserSchema,
  resultsSchema,
} from "./logic/schemas.tsx";
import { shuffle } from "./logic/shuffle.ts";
import { TAssignment, TProject, TUser } from "./logic/types.ts";
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
  const { name } = c.req.valid("form");
  const newProject: TProject = { id: nanoid(14), name, assignments: null };
  await kv.set(["project", newProject.id], newProject);
  return c.redirect(`/${newProject.id}`);
});

app.get("/:projectId", async (c) => {
  const projectId = c.req.param("projectId");
  const project = await kv.get<TProject>(["project", projectId]);
  if (!project.value) {
    return c.html(<NotFound />, 404);
  }
  // get users
  const usersIter = kv.list<TUser>({ prefix: ["project", projectId, "user"] });
  const users = (await Array.fromAsync(usersIter)).map((entry) => entry.value);

  return c.html(<Project project={project.value} users={users} />);
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
  const project = await kv.get<TProject>(["project", projectId]);
  if (!project.value) {
    return c.html(<NotFound />, 404);
  }
  return c.html(<ConfirmDraw project={project.value} />);
});

app.post("/:projectId/tirage-au-sort", async (c) => {
  const projectId = c.req.param("projectId");
  const project = await kv.get<TProject>(["project", projectId]);
  if (!project.value) {
    return c.html(<NotFound />, 404);
  }
  // Create assignments
  const usersIter = kv.list<TUser>({ prefix: ["project", projectId, "user"] });
  const users = (await Array.fromAsync(usersIter)).map((entry) => entry.value);
  const shuffledUsers = shuffle(users);
  const assignments: TAssignment[] = [];
  for (let i = 0; i < users.length; i++) {
    const fromUser = shuffledUsers[i];
    const toUser = shuffledUsers[(i + 1) % users.length];
    assignments.push({ from: fromUser.id, to: toUser.id });
  }
  project.value.assignments = assignments;
  await kv.set(["project", projectId], project.value);
  return c.redirect(`/${projectId}`);
});

app.get("/:projectId/resultats", async (c) => {
  const projectId = c.req.param("projectId");
  const project = await kv.get<TProject>(["project", projectId]);
  if (!project.value) {
    return c.html(<NotFound />, 404);
  }
  // get users
  const usersIter = kv.list<TUser>({ prefix: ["project", projectId, "user"] });
  const users = (await Array.fromAsync(usersIter)).map((entry) => entry.value);

  return c.html(<Results project={project.value} users={users} />);
});

app.post(
  "/:projectId/resultats",
  sValidator("form", resultsSchema),
  async (c) => {
    const { userId, password } = c.req.valid("form");
    const projectId = c.req.param("projectId");
    const project = await kv.get<TProject>(["project", projectId]);
    if (!project.value) {
      return c.html(<NotFound />, 404);
    }
    const usersIter = kv.list<TUser>({
      prefix: ["project", projectId, "user"],
    });
    const users = (await Array.fromAsync(usersIter)).map(
      (entry) => entry.value
    );

    const user = users.find((u) => u.id === userId);
    const userAssignments = project.value.assignments?.find(
      (a) => a.from === userId
    );
    const toUser = users.find((u) => u.id === userAssignments?.to);

    if (!user || !toUser) {
      return c.html(
        <Results project={project.value} users={users} invalidPassword />
      );
    }
    if (!(await verify(password, user.passwordHash))) {
      return c.html(
        <Results project={project.value} users={users} invalidPassword />
      );
    }

    return c.html(
      <Results
        project={project.value}
        users={users}
        assignment={{ from: user, to: toUser }}
      />
    );
  }
);

app.notFound((c) => c.html(<NotFound />, 404));

Deno.serve(app.fetch);
