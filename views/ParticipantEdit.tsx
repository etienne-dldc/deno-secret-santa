import { Card } from "../components/Card.tsx";
import { Layout } from "../components/Layout.tsx";
import { Link } from "../components/Link.tsx";
import { RedButton } from "../components/RedButton.tsx";
import { TextField } from "../components/TextField.tsx";
import { TextareaField } from "../components/TextareaField.tsx";
import { TProject, TUser } from "../logic/types.ts";

interface ParticipantEditProps {
  project: TProject;
  user: TUser;
  invalidPassword?: boolean;
  unlockedPassword?: string;
  updateSuccess?: string;
}

export function ParticipantEdit({
  project,
  user,
  invalidPassword,
  unlockedPassword,
  updateSuccess,
}: ParticipantEditProps) {
  const isPasswordProtected = !!project.passwordHash || true; // Always protected by user password
  const isUnlocked = !!unlockedPassword;

  // If not unlocked, show password unlock UI
  if (!isUnlocked) {
    return (
      <Layout>
        <Card>
          <h1 class="text-3xl font-bold">Modifier le profil</h1>
          <p class="text-gray-700">
            Cette page est protégée. Veuillez entrer votre mot de passe pour
            continuer.
          </p>
          <Link href={`/${project.id}`}>
            &larr; Retour à <em class="font-bold not-italic">{project.name}</em>
          </Link>

          <form method="post" class="space-y-4">
            <input type="hidden" name="action" value="unlockParticipant" />
            <TextField
              id="password"
              name="password"
              label="Mot de passe"
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

  // Show full UI when unlocked
  return (
    <Layout>
      <Card>
        <h1 class="text-3xl font-bold">Modifier le profil</h1>
        <p class="text-gray-700">
          Profil de <strong>{user.name}</strong>
        </p>
        <Link href={`/${project.id}`}>
          &larr; Retour à <em class="font-bold not-italic">{project.name}</em>
        </Link>

        {updateSuccess && (
          <div class="bg-green-50 border border-green-200 rounded-lg p-4">
            <p class="text-green-600 text-sm">{updateSuccess}</p>
          </div>
        )}

        {/* Update Hint Form */}
        <div class="space-y-4">
          <h2 class="text-xl font-bold">Modifier l'indice</h2>
          <form method="post" class="space-y-4">
            <input type="hidden" name="action" value="updateHint" />
            <input type="hidden" name="password" value={unlockedPassword} />
            <TextareaField
              id="hint"
              name="hint"
              label="Indice"
              placeholder="ex. : J'aime les sports d'hiver..."
              rows={3}
              value={user.hint}
            />
            <RedButton type="submit">💾 Enregistrer l'indice</RedButton>
          </form>
        </div>

        {/* Update Password Form */}
        <div class="space-y-4">
          <h2 class="text-xl font-bold">Modifier le mot de passe</h2>
          <form method="post" class="space-y-4">
            <input type="hidden" name="action" value="updatePassword" />
            <input type="hidden" name="password" value={unlockedPassword} />
            <TextField
              id="newPassword"
              name="newPassword"
              label="Nouveau mot de passe"
              type="password"
              required
            />
            <div class="text-sm text-gray-600 px-1">
              <p class="wrap-balance">
                ⚠️ En cas de perte, le mot de passe ne pourra pas être
                récupéré. Conservez-le en lieu sûr.
              </p>
            </div>
            <RedButton type="submit">🔑 Modifier le mot de passe</RedButton>
          </form>
        </div>

        {/* Delete User Form */}
        <div class="space-y-4">
          <h2 class="text-xl font-bold text-red-600">Supprimer le participant</h2>
          <p class="text-gray-700 text-sm">
            ⚠️ Cette action est irréversible. Le participant sera définitivement
            supprimé du projet.
          </p>
          <form
            method="post"
            class="space-y-4"
            onsubmit="return confirm('Êtes-vous sûr de vouloir supprimer ce participant ?');"
          >
            <input type="hidden" name="action" value="deleteUser" />
            <input type="hidden" name="password" value={unlockedPassword} />
            <RedButton type="submit">🗑️ Supprimer le participant</RedButton>
          </form>
        </div>
      </Card>
    </Layout>
  );
}
