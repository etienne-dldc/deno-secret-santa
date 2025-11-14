import { Card } from "../components/Card.tsx";
import { ConstraintForm } from "../components/ConstraintForm.tsx";
import { ConstraintItem } from "../components/ConstraintItem.tsx";
import { Layout } from "../components/Layout.tsx";
import { Link } from "../components/Link.tsx";
import { RedButton } from "../components/RedButton.tsx";
import { TextField } from "../components/TextField.tsx";
import { TProject, TUser } from "../logic/types.ts";

interface ConfirmDrawProps {
  project: TProject;
  users: TUser[];
  invalidPassword?: boolean;
  constraintError?: string;
  drawError?: string;
  unlockedPassword?: string;
}

export function ConfirmDraw({
  project,
  users,
  invalidPassword,
  constraintError,
  drawError,
  unlockedPassword,
}: ConfirmDrawProps) {
  const constraints = project.constraints || [];
  const isPasswordProtected = !!project.passwordHash;
  const isUnlocked = isPasswordProtected && !!unlockedPassword;

  // If password protected and not unlocked, show password unlock UI
  if (isPasswordProtected && !isUnlocked) {
    return (
      <Layout>
        <Card>
          <h1 class="text-3xl font-bold">Prêt pour le tirage au sort ?</h1>
          <p class="text-gray-700">
            Ce projet est protégé par un mot de passe administrateur.
          </p>
          <Link href={`/${project.id}`}>
            &larr; Retour à <em class="font-bold not-italic">{project.name}</em>
          </Link>

          <form method="post" class="space-y-4">
            <input type="hidden" name="action" value="unlock" />
            <TextField
              id="password"
              name="password"
              label="Mot de passe administrateur"
              type="password"
              required
            />
            {invalidPassword && (
              <p class="text-red-600 text-sm">Mot de passe incorrect</p>
            )}
            <RedButton type="submit">🔓 Déverrouiller</RedButton>
          </form>
        </Card>
      </Layout>
    );
  }

  // Show full UI (unlocked or no password)
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
              {constraints.map((constraint, index) => (
                <ConstraintItem
                  key={index}
                  constraint={constraint}
                  index={index}
                  users={users}
                  password={unlockedPassword}
                />
              ))}
            </ul>
          )}

          {/* Add Constraint Form */}
          <ConstraintForm 
            users={users} 
            constraintError={constraintError}
            password={unlockedPassword}
          />
        </div>

        {/* Draw Confirmation */}
        <form method="post" class="space-y-4">
          <input type="hidden" name="action" value="confirmDraw" />
          {isPasswordProtected && (
            <input type="hidden" name="password" value={unlockedPassword} />
          )}
          {drawError && (
            <div class="bg-red-50 border border-red-200 rounded-lg p-4">
              <p class="text-red-600 text-sm">{drawError}</p>
            </div>
          )}
          <RedButton type="submit">🎲 Confirmer le tirage au sort</RedButton>
        </form>
      </Card>
    </Layout>
  );
}
