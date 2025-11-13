import { TAssignment, TConstraint } from "./types.ts";

export function checkConstraints(
  assignments: TAssignment[],
  constraints: TConstraint[]
): boolean {
  for (const constraint of constraints) {
    for (const assignment of assignments) {
      switch (constraint.kind) {
        case "no_gift_exchange":
          // Check if left gives to right OR right gives to left
          if (
            (assignment.from === constraint.left &&
              assignment.to === constraint.right) ||
            (assignment.from === constraint.right &&
              assignment.to === constraint.left)
          ) {
            return false;
          }
          break;
        case "cannot_give_to":
          // Check if left gives to right
          if (
            assignment.from === constraint.left &&
            assignment.to === constraint.right
          ) {
            return false;
          }
          break;
        case "cannot_receive_from":
          // Check if left receives from right (i.e., right gives to left)
          if (
            assignment.from === constraint.right &&
            assignment.to === constraint.left
          ) {
            return false;
          }
          break;
      }
    }
  }
  return true;
}
