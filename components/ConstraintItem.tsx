import { TConstraint, TConstraintKind, TUser } from "../logic/types.ts";

interface ConstraintItemProps {
  constraint: TConstraint;
  index: number;
  users: TUser[];
}

export function ConstraintItem({
  constraint,
  index,
  users,
}: ConstraintItemProps) {
  const leftUser = users.find((u) => u.id === constraint.left);
  const rightUser = users.find((u) => u.id === constraint.right);

  const getConstraintText = (
    leftUser: TUser | undefined,
    rightUser: TUser | undefined,
    kind: TConstraintKind
  ) => {
    if (!leftUser || !rightUser) return null;

    switch (kind) {
      case "no_gift_exchange":
        return (
          <>
            <strong>{leftUser.name}</strong> et <strong>{rightUser.name}</strong>{" "}
            ne se font pas de cadeau
          </>
        );
      case "cannot_give_to":
        return (
          <>
            <strong>{leftUser.name}</strong> ne fait pas de cadeau à{" "}
            <strong>{rightUser.name}</strong>
          </>
        );
      case "cannot_receive_from":
        return (
          <>
            <strong>{leftUser.name}</strong> ne reçoit pas de cadeau de{" "}
            <strong>{rightUser.name}</strong>
          </>
        );
    }
  };

  return (
    <li
      key={index}
      class="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
    >
      <span class="text-sm">
        {getConstraintText(leftUser, rightUser, constraint.kind)}
      </span>
      <form method="post" class="inline">
        <input type="hidden" name="action" value="deleteConstraint" />
        <input type="hidden" name="index" value={index.toString()} />
        <button
          type="submit"
          class="text-red-600 hover:text-red-800 hover:underline text-sm font-medium transition-all"
        >
          Supprimer
        </button>
      </form>
    </li>
  );
}
