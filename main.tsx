import { Hono } from "hono";
import { Home } from "./views/Home.tsx";

const kv = await Deno.openKv();

interface Project {
  id: string;
  name: string;
  description: string;
}

const app = new Hono();

app.get("/", async (c) => {
  const projects = (await kv.get<Project[]>(["projects"])).value ?? [];

  console.log(projects);

  return c.html(<Home />);
});

Deno.serve(app.fetch);
