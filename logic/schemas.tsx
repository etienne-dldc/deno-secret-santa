import * as v from "@valibot/valibot";

export const createProjectSchema = v.object({
  action: v.literal("createProject"),
  name: v.string(),
});

export const createUserSchema = v.object({
  action: v.literal("createUser"),
  name: v.string(),
  hint: v.string(),
  password: v.string(),
});

export const resultsSchema = v.object({
  action: v.literal("viewResults"),
  userId: v.string(),
  password: v.string(),
});
