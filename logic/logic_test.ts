import { assertEquals } from "jsr:@std/assert";
import { addConstraint } from "./addConstraint.ts";
import { checkConstraints } from "./checkConstraints.ts";
import { computeAssignment } from "./computeAssignment.ts";
import { confirmDraw } from "./confirmDraw.ts";
import { deleteConstraint } from "./deleteConstraint.ts";
import { TProject, TUser } from "./types.ts";

// Test for backward compatibility - projects without createdAt should still work
Deno.test("Project - works without createdAt (backward compatibility)", () => {
  const project: TProject = {
    id: "test",
    name: "Test Project",
    assignments: null,
    // No createdAt field
  };

  // Should be able to add constraints without issues
  const result = addConstraint(project, {
    left: "user1",
    right: "user2",
    kind: "no_gift_exchange",
  });

  assertEquals(result.success, true);
  assertEquals(result.updatedProject?.constraints?.length, 1);
});

// Test that new projects can have createdAt
Deno.test("Project - can include createdAt timestamp", () => {
  const now = Date.now();
  const project: TProject = {
    id: "test",
    name: "Test Project",
    assignments: null,
    createdAt: now,
  };

  assertEquals(project.createdAt, now);
  assertEquals(typeof project.createdAt, "number");
});

Deno.test("addConstraint - prevents adding constraints after draw", () => {
  const project: TProject = {
    id: "test",
    name: "Test Project",
    assignments: [{ from: "user1", to: "user2" }], // Draw already done
  };

  const result = addConstraint(project, {
    left: "user1",
    right: "user2",
    kind: "no_gift_exchange",
  });

  assertEquals(result.success, false);
  assertEquals(
    result.error,
    "Impossible d'ajouter des contraintes après le tirage au sort."
  );
});

Deno.test("addConstraint - prevents same user constraint", () => {
  const project: TProject = {
    id: "test",
    name: "Test Project",
    assignments: null,
  };

  const result = addConstraint(project, {
    left: "user1",
    right: "user1",
    kind: "no_gift_exchange",
  });

  assertEquals(result.success, false);
  assertEquals(
    result.error,
    "Une contrainte ne peut pas avoir la même personne des deux côtés."
  );
});

Deno.test("addConstraint - successfully adds valid constraint", () => {
  const project: TProject = {
    id: "test",
    name: "Test Project",
    assignments: null,
  };

  const result = addConstraint(project, {
    left: "user1",
    right: "user2",
    kind: "no_gift_exchange",
  });

  assertEquals(result.success, true);
  assertEquals(result.updatedProject?.constraints?.length, 1);
  assertEquals(result.updatedProject?.constraints?.[0].left, "user1");
});

Deno.test("deleteConstraint - prevents deleting constraints after draw", () => {
  const project: TProject = {
    id: "test",
    name: "Test Project",
    assignments: [{ from: "user1", to: "user2" }], // Draw already done
    constraints: [{ left: "user1", right: "user3", kind: "no_gift_exchange" }],
  };

  const result = deleteConstraint(project, { index: 0 });

  assertEquals(result.success, false);
  assertEquals(
    result.error,
    "Impossible de supprimer des contraintes après le tirage au sort."
  );
});

Deno.test("deleteConstraint - successfully deletes constraint", () => {
  const project: TProject = {
    id: "test",
    name: "Test Project",
    assignments: null,
    constraints: [
      { left: "user1", right: "user3", kind: "no_gift_exchange" },
      { left: "user2", right: "user4", kind: "cannot_give_to" },
    ],
  };

  const result = deleteConstraint(project, { index: 0 });

  assertEquals(result.success, true);
  assertEquals(result.updatedProject?.constraints?.length, 1);
  assertEquals(result.updatedProject?.constraints?.[0].left, "user2");
});

Deno.test("confirmDraw - prevents draw if already done", async () => {
  const project: TProject = {
    id: "test",
    name: "Test Project",
    assignments: [{ from: "user1", to: "user2" }], // Draw already done
  };

  const users: TUser[] = [
    {
      id: "user1",
      name: "User 1",
      hint: "Hint 1",
      passwordHash: "hash1",
    },
    {
      id: "user2",
      name: "User 2",
      hint: "Hint 2",
      passwordHash: "hash2",
    },
  ];

  const result = await confirmDraw(project, users, {});

  assertEquals(result.success, false);
  assertEquals(result.drawError, "Le tirage au sort a déjà été effectué.");
});

Deno.test("checkConstraints - validates no_gift_exchange constraint", () => {
  const assignments = [
    { from: "user1", to: "user2" },
    { from: "user2", to: "user3" },
    { from: "user3", to: "user1" },
  ];

  const constraints = [
    { left: "user1", right: "user2", kind: "no_gift_exchange" as const },
  ];

  const result = checkConstraints(assignments, constraints);
  assertEquals(result, false); // Should fail because user1 gives to user2
});

Deno.test("checkConstraints - validates cannot_give_to constraint", () => {
  const assignments = [
    { from: "user1", to: "user2" },
    { from: "user2", to: "user3" },
    { from: "user3", to: "user1" },
  ];

  const constraints = [
    { left: "user1", right: "user2", kind: "cannot_give_to" as const },
  ];

  const result = checkConstraints(assignments, constraints);
  assertEquals(result, false); // Should fail because user1 gives to user2
});

Deno.test("computeAssignment - creates valid assignments", () => {
  const users: TUser[] = [
    { id: "user1", name: "User 1", hint: "Hint 1", passwordHash: "hash1" },
    { id: "user2", name: "User 2", hint: "Hint 2", passwordHash: "hash2" },
    { id: "user3", name: "User 3", hint: "Hint 3", passwordHash: "hash3" },
  ];

  const constraints = [];

  const result = computeAssignment(users, constraints);

  assertEquals(result !== null, true);
  assertEquals(result?.length, 3);
  // Each user should give to exactly one person
  const fromIds = result?.map((a) => a.from).sort();
  const toIds = result?.map((a) => a.to).sort();
  assertEquals(fromIds, ["user1", "user2", "user3"]);
  assertEquals(toIds, ["user1", "user2", "user3"]);
});
