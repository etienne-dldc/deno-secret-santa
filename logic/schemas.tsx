import * as v from "@valibot/valibot";

export const createProjectSchema = v.object({
  action: v.literal("createProject"),
  name: v.string(),
  password: v.optional(v.string()),
});

export const createUserSchema = v.object({
  action: v.literal("createUser"),
  name: v.string(),
  hint: v.string(),
  password: v.string(),
});

export const confirmDrawSchema = v.object({
  action: v.literal("confirmDraw"),
  password: v.optional(v.string()),
});

export const resultsSchema = v.object({
  action: v.literal("viewResults"),
  userId: v.string(),
  password: v.string(),
});

export const addConstraintSchema = v.object({
  action: v.literal("addConstraint"),
  left: v.string(),
  right: v.string(),
  kind: v.union([
    v.literal("no_gift_exchange"),
    v.literal("cannot_give_to"),
    v.literal("cannot_receive_from"),
  ]),
});

export const deleteConstraintSchema = v.object({
  action: v.literal("deleteConstraint"),
  index: v.pipe(v.string(), v.transform(Number)),
});
