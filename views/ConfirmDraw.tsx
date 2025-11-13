import { Card } from "../components/Card.tsx";
import { Layout } from "../components/Layout.tsx";
import { Link } from "../components/Link.tsx";
import { RedButton } from "../components/RedButton.tsx";
import { TextField } from "../components/TextField.tsx";
import { TConstraintKind, TProject, TUser } from "../logic/types.ts";

interface ConfirmDrawProps {
  project: TProject;
  users: TUser[];
  invalidPassword?: boolean;
  constraintError?: string;
  drawError?: string;
}

export function ConfirmDraw({
  project,
  users,
  invalidPassword,
  constraintError,
  drawError,
}: ConfirmDrawProps) {
  const constraints = project.constraints || [];

  const getConstraintText = (
    leftUser: TUser | undefined,
    rightUser: TUser | undefined,
    kind: TConstraintKind
  ): string => {
    if (!leftUser || !rightUser) return "";
    
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
    <Layout>
      <Card>
        <h1 class="text-3xl font-bold">Prêt pour le tirage au sort ?</h1>
        <p class="text-gray-700">
          Une fois le tirage au sort confirmé, il ne sera plus possible
          d'ajouter ou de supprimer des participants.
        </p>
        <Link href={`/${project.id}`}>
          &larr; Retour à <em class="font-bold not-italic">{project.name}</em>
        </Link>

        {/* Constraints Section */}
        <div class="space-y-4">
          <h2 class="text-xl font-bold">Contraintes</h2>
          
          {constraints.length === 0 ? (
            <p class="text-gray-600 text-sm">Aucune contrainte définie.</p>
          ) : (
            <ul class="space-y-2">
              {constraints.map((constraint, index) => {
                const leftUser = users.find((u) => u.id === constraint.left);
                const rightUser = users.find((u) => u.id === constraint.right);
                return (
                  <li key={index} class="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <span class="text-sm">
                      {getConstraintText(leftUser, rightUser, constraint.kind)}
                    </span>
                    <form method="post" class="inline">
                      <input type="hidden" name="action" value="deleteConstraint" />
                      <input type="hidden" name="index" value={index.toString()} />
                      <button
                        type="submit"
                        class="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Supprimer
                      </button>
                    </form>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Add Constraint Form */}
          <form method="post" class="space-y-3 bg-gray-50 p-4 rounded-lg">
            <input type="hidden" name="action" value="addConstraint" />
            <h3 class="font-semibold text-sm">Ajouter une contrainte</h3>
            
            <div class="grid grid-cols-3 gap-2">
              <select
                name="left"
                required
                class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all text-sm"
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
                class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all text-sm"
              >
                <option value="">Type</option>
                <option value="no_gift_exchange">ne se font pas de cadeau</option>
                <option value="cannot_give_to">ne fait pas de cadeau à</option>
                <option value="cannot_receive_from">ne reçoit pas de cadeau de</option>
              </select>

              <select
                name="right"
                required
                class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all text-sm"
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
        </div>

        {/* Draw Confirmation */}
        <form method="post" class="space-y-4">
          <input type="hidden" name="action" value="confirmDraw" />
          {project.passwordHash && (
            <>
              <TextField
                id="password"
                name="password"
                label="Mot de passe du projet"
                type="password"
                required
              />
              {invalidPassword && (
                <p class="text-red-600 text-sm">Mot de passe incorrect</p>
              )}
            </>
          )}
          {drawError && (
            <div class="bg-red-50 border border-red-200 rounded-lg p-4">
              <p class="text-red-600 text-sm">{drawError}</p>
            </div>
          )}
          <RedButton type="submit">Confirmer le tirage au sort</RedButton>
        </form>
      </Card>
    </Layout>
  );
}
