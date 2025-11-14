import { verify } from "@felix/bcrypt";
import { TProject, TUser } from "./types.ts";

// Helper function to verify participant password (user password OR project password OR admin password)
export async function verifyParticipantPassword(
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
