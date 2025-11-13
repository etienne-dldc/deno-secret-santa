import { TProject } from "./types.ts";

export interface DeleteConstraintInput {
  index: number;
}

export interface DeleteConstraintResult {
  success: boolean;
  error?: string;
  updatedProject?: TProject;
}

export function deleteConstraint(
  project: TProject,
  input: DeleteConstraintInput
): DeleteConstraintResult {
  // Check if draw has already been done
  if (project.assignments !== null) {
    return {
      success: false,
      error: "Impossible de supprimer des contraintes après le tirage au sort.",
    };
  }

  const constraints = project.constraints || [];
  const newConstraints = [...constraints];
  newConstraints.splice(input.index, 1);

  const updatedProject = {
    ...project,
    constraints: newConstraints,
  };

  return {
    success: true,
    updatedProject,
  };
}
