import * as v from "@valibot/valibot";

export const createProjectSchema = v.object({
  action: v.literal("createProject"),
  name: v.string(),
  description: v.string(),
});
