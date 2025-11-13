import { hash, verify } from "@felix/bcrypt";
import { sValidator } from "@hono/standard-validator";
import { nanoid } from "@sitnik/nanoid";
import { Hono } from "hono";
import {
  createProjectSchema,
  createUserSchema,
  resultsSchema,
  tirageAuSortSchema,
} from "./logic/schemas.tsx";
import { checkConstraints, shuffle } from "./logic/shuffle.ts";
import { TAssignment, TConstraint, TProject, TUser } from "./logic/types.ts";
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
  // get users
  const usersIter = kv.list<TUser>({ prefix: ["project", projectId, "user"] });
  const users = (await Array.fromAsync(usersIter)).map((entry) => entry.value);

  return c.html(<ConfirmDraw project={project.value} users={users} />);
});

app.post(
  "/:projectId/tirage-au-sort",
  sValidator("form", tirageAuSortSchema),
  async (c) => {
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

    const data = c.req.valid("form");

    // Handle adding constraint
    if (data.action === "addConstraint") {
      const { left, right, kind } = data;

      // Validate same user
      if (left === right) {
        return c.html(
          <ConfirmDraw
            project={project.value}
            users={users}
            constraintError="Une contrainte ne peut pas avoir la même personne des deux côtés."
          />
        );
      }

      const newConstraint: TConstraint = { left, right, kind };

      // Check if constraint already exists or conflicts
      let constraints = project.value.constraints || [];

      // Check for exact duplicate (including order swap for bidirectional)
      const exactDuplicate = constraints.some((c) => {
        if (c.kind === newConstraint.kind && newConstraint.kind === "no_gift_exchange") {
          // For bidirectional, check both orders
          return (
            (c.left === newConstraint.left && c.right === newConstraint.right) ||
            (c.left === newConstraint.right && c.right === newConstraint.left)
          );
        }
        // For directional, check exact match
        return (
          c.left === newConstraint.left &&
          c.right === newConstraint.right &&
          c.kind === newConstraint.kind
        );
      });

      if (exactDuplicate) {
        return c.html(
          <ConfirmDraw
            project={project.value}
            users={users}
            constraintError="Cette contrainte existe déjà."
          />
        );
      }

      // Check if there's already a "no_gift_exchange" constraint between these users
      const hasNoGiftExchange = constraints.some(
        (c) =>
          c.kind === "no_gift_exchange" &&
          ((c.left === newConstraint.left && c.right === newConstraint.right) ||
           (c.left === newConstraint.right && c.right === newConstraint.left))
      );

      if (hasNoGiftExchange && newConstraint.kind !== "no_gift_exchange") {
        return c.html(
          <ConfirmDraw
            project={project.value}
            users={users}
            constraintError="Ces personnes ont déjà une contrainte \"ne se font pas de cadeau\" qui bloque tous les échanges."
          />
        );
      }

      // If adding "no_gift_exchange", remove any narrower constraints between these users
      if (newConstraint.kind === "no_gift_exchange") {
        constraints = constraints.filter(
          (c) =>
            !(
              (c.left === newConstraint.left && c.right === newConstraint.right) ||
              (c.left === newConstraint.right && c.right === newConstraint.left)
            )
        );
      }

      project.value.constraints = [...constraints, newConstraint];
      await kv.set(["project", projectId], project.value);
      return c.redirect(`/${projectId}/tirage-au-sort`);
    }

    // Handle deleting constraint
    if (data.action === "deleteConstraint") {
      const { index } = data;
      const constraints = project.value.constraints || [];
      constraints.splice(index, 1);
      project.value.constraints = constraints;
      await kv.set(["project", projectId], project.value);
      return c.redirect(`/${projectId}/tirage-au-sort`);
    }

    // Handle confirm draw
    if (data.action === "confirmDraw") {
      const { password } = data;

      // Verify password if project has one
      if (project.value.passwordHash) {
        if (!password) {
          return c.html(
            <ConfirmDraw project={project.value} users={users} invalidPassword />
          );
        }
        if (!(await verify(password, project.value.passwordHash))) {
          return c.html(
            <ConfirmDraw project={project.value} users={users} invalidPassword />
          );
        }
      }

      // Create assignments with constraint checking
      const constraints = project.value.constraints || [];
      const maxAttempts = 10000;
      let attempts = 0;
      let validAssignments: TAssignment[] | null = null;

      while (attempts < maxAttempts) {
        attempts++;
        const shuffledUsers = shuffle(users);
        const assignments: TAssignment[] = [];
        for (let i = 0; i < users.length; i++) {
          const fromUser = shuffledUsers[i];
          const toUser = shuffledUsers[(i + 1) % users.length];
          assignments.push({ from: fromUser.id, to: toUser.id });
        }

        if (checkConstraints(assignments, constraints)) {
          validAssignments = assignments;
          break;
        }
      }

      if (!validAssignments) {
        return c.html(
          <ConfirmDraw
            project={project.value}
            users={users}
            drawError="Impossible de générer un tirage au sort respectant toutes les contraintes après 10000 tentatives. Veuillez supprimer certaines contraintes."
          />
        );
      }

      project.value.assignments = validAssignments;
      await kv.set(["project", projectId], project.value);
      return c.redirect(`/${projectId}`);
    }

    return c.html(<NotFound />, 404);
  }
);

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
