import { verify } from "@felix/bcrypt";
import { computeAssignment } from "./computeAssignment.ts";
import { TProject, TUser } from "./types.ts";

export interface ConfirmDrawInput {
  password?: string;
}

export interface ConfirmDrawResult {
  success: boolean;
  invalidPassword?: boolean;
  drawError?: string;
  updatedProject?: TProject;
}

export async function confirmDraw(
  project: TProject,
  users: TUser[],
  input: ConfirmDrawInput
): Promise<ConfirmDrawResult> {
  // Check if draw has already been done
  if (project.assignments !== null) {
    return {
      success: false,
      drawError: "Le tirage au sort a déjà été effectué.",
    };
  }

  // Verify password if project has one
  if (project.passwordHash) {
    if (!input.password) {
      return {
        success: false,
        invalidPassword: true,
      };
    }
    if (!(await verify(input.password, project.passwordHash))) {
      return {
        success: false,
        invalidPassword: true,
      };
    }
  }

  // Create assignments with constraint checking
  const constraints = project.constraints || [];
  const validAssignments = computeAssignment(users, constraints);

  if (!validAssignments) {
    return {
      success: false,
      drawError:
        "Impossible de générer un tirage au sort respectant toutes les contraintes après 10000 tentatives. Veuillez supprimer certaines contraintes.",
    };
  }

  const updatedProject = {
    ...project,
    assignments: validAssignments,
  };

  return {
    success: true,
    updatedProject,
  };
}
