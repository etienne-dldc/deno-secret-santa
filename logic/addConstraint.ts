import { TConstraint, TProject } from "./types.ts";

export interface AddConstraintInput {
  left: string;
  right: string;
  kind: "no_gift_exchange" | "cannot_give_to" | "cannot_receive_from";
}

export interface AddConstraintResult {
  success: boolean;
  error?: string;
  updatedProject?: TProject;
}

export function addConstraint(
  project: TProject,
  input: AddConstraintInput
): AddConstraintResult {
  const { left, right, kind } = input;

  // Validate same user
  if (left === right) {
    return {
      success: false,
      error:
        "Une contrainte ne peut pas avoir la même personne des deux côtés.",
    };
  }

  // Check if draw has already been done
  if (project.assignments !== null) {
    return {
      success: false,
      error: "Impossible d'ajouter des contraintes après le tirage au sort.",
    };
  }

  const newConstraint: TConstraint = { left, right, kind };

  // Check if constraint already exists or conflicts
  let constraints = project.constraints || [];

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
    return {
      success: false,
      error: "Cette contrainte existe déjà.",
    };
  }

  // Check if there's already a "no_gift_exchange" constraint between these users
  const hasNoGiftExchange = constraints.some(
    (c) =>
      c.kind === "no_gift_exchange" &&
      ((c.left === newConstraint.left && c.right === newConstraint.right) ||
       (c.left === newConstraint.right && c.right === newConstraint.left))
  );

  if (hasNoGiftExchange && newConstraint.kind !== "no_gift_exchange") {
    return {
      success: false,
      error: `Ces personnes ont déjà une contrainte "ne se font pas de cadeau" qui bloque tous les échanges.`,
    };
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

  const updatedProject = {
    ...project,
    constraints: [...constraints, newConstraint],
  };

  return {
    success: true,
    updatedProject,
  };
}
