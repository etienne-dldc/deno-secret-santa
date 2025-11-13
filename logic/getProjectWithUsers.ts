import { TProject, TUser } from "./types.ts";

export async function getProjectWithUsers(
  kv: Deno.Kv,
  projectId: string
): Promise<{ project: TProject; users: TUser[] } | null> {
  const projectResult = await kv.get<TProject>(["project", projectId]);
  if (!projectResult.value) {
    return null;
  }

  const usersIter = kv.list<TUser>({ prefix: ["project", projectId, "user"] });
  const users = (await Array.fromAsync(usersIter)).map((entry) => entry.value);

  return { project: projectResult.value, users };
}
