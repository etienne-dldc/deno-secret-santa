import { TAssignment, TConstraint } from "./types.ts";

export function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let index = 0; index < copy.length; index++) {
    const i1 = Math.floor(Math.random() * copy.length);
    const i2 = Math.floor(Math.random() * copy.length);
    if (i1 !== i2) {
      const tmp = copy[i2];
      copy[i2] = copy[i1];
      copy[i1] = tmp;
    }
  }
  return copy;
}

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
