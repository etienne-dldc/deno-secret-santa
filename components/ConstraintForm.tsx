import { TUser } from "../logic/types.ts";

interface ConstraintFormProps {
  users: TUser[];
  constraintError?: string;
  password?: string;
}

export function ConstraintForm({ users, constraintError, password }: ConstraintFormProps) {
  return (
    <form method="post" class="space-y-3 bg-gray-50 p-4 rounded-lg">
      <input type="hidden" name="action" value="addConstraint" />
      {password && <input type="hidden" name="password" value={password} />}
      <h3 class="font-semibold text-sm">Ajouter une contrainte</h3>

      <div class="space-y-2">
        <select
          name="left"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all text-sm"
        >
          <option value="">Personne 1</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>

        <select
          name="kind"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all text-sm"
        >
          <option value="">Type</option>
          <option value="no_gift_exchange">ne se font pas de cadeau</option>
          <option value="cannot_give_to">ne fait pas de cadeau à</option>
          <option value="cannot_receive_from">
            ne reçoit pas de cadeau de
          </option>
        </select>

        <select
          name="right"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all text-sm"
        >
          <option value="">Personne 2</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      {constraintError && (
        <p class="text-red-600 text-sm">{constraintError}</p>
      )}

      <button
        type="submit"
        class="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-all text-sm"
      >
        Ajouter la contrainte
      </button>
    </form>
  );
}
