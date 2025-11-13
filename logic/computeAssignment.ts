import { checkConstraints } from "./checkConstraints.ts";
import { shuffle } from "./shuffle.ts";
import { TAssignment, TConstraint, TUser } from "./types.ts";

export function computeAssignment(
  users: TUser[],
  constraints: TConstraint[]
): TAssignment[] | null {
  const maxAttempts = 10000;
  let attempts = 0;

  while (attempts < maxAttempts) {
    attempts++;
    const shuffledUsers = shuffle(users);
    const assignments: TAssignment[] = [];
    for (let i = 0; i < users.length; i++) {
      const fromUser = shuffledUsers[i];
      const toUser = shuffledUsers[(i + 1) % users.length];
      assignments.push({ from: fromUser.id, to: toUser.id });
    }

    if (checkConstraints(assignments, constraints)) {
      return assignments;
    }
  }

  return null;
}
