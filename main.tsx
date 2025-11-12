import { sValidator } from "@hono/standard-validator";
import { nanoid } from "@sitnik/nanoid";
import { Hono } from "hono";
import { createProjectSchema } from "./logic/schemas.tsx";
import { TProject, TUser } from "./logic/types.ts";
import { Home } from "./views/Home.tsx";
import { NotFound } from "./views/NotFound.tsx";
import { Project } from "./views/Project.tsx";

const kv = await Deno.openKv();

const app = new Hono();

app.get("/", (c) => c.html(<Home />));

app.post("/", sValidator("form", createProjectSchema), async (c) => {
  const { name, description } = c.req.valid("form");
  const newProject: TProject = {
    id: nanoid(14),
    name,
    description,
    assignments: null,
  };
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

app.notFound((c) => c.html(<NotFound />));

Deno.serve(app.fetch);
