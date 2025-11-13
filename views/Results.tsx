import { Card } from "../components/Card.tsx";
import { Layout } from "../components/Layout.tsx";
import { Link } from "../components/Link.tsx";
import { RedButton } from "../components/RedButton.tsx";
import { TextField } from "../components/TextField.tsx";
import { TProject, TUser } from "../logic/types.ts";

interface ResultsProps {
  project: TProject;
  users: TUser[];
  invalidPassword?: boolean;
  assignment?: { from: TUser; to: TUser };
}

export function Results({
  project,
  users,
  invalidPassword,
  assignment,
}: ResultsProps) {
  return (
    <Layout>
      <Card>
        <h1 class="text-3xl font-bold">Résultats</h1>
        <Link href={`/${project.id}`}>
          &larr; Retour à <em class="font-bold not-italic">{project.name}</em>
        </Link>
        {assignment ? (
          <div class="flex flex-col gap-4">
            <p class="text-gray-700">
              Bonjour <strong>{assignment.from.name}</strong> ! Tu offres un
              cadeau à
            </p>
            <h2 class="text-2xl font-bold text-center">{assignment.to.name}</h2>
            {assignment.to.hint && (
              <>
                <p>{assignment.to.name} a laissé un indice pour toi :</p>
                <blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-600">
                  {assignment.to.hint}
                </blockquote>
              </>
            )}
          </div>
        ) : (
          <form method="post" class="flex flex-col gap-4">
            <input type="hidden" name="action" value="viewResults" />

            <label class="flex flex-col">
              <span class="font-medium">Participant</span>
              <select name="userId" required class="mt-1 p-2 border rounded">
                <option value="" disabled selected>
                  -- Choisir un participant --
                </option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </label>

            <TextField
              id="password"
              name="password"
              label="Mot de passe"
              type="password"
              required
            />

            {invalidPassword && (
              <p class="text-red-600">
                Mot de passe incorrect. Veuillez réessayer.
              </p>
            )}

            <RedButton type="submit">Voir mon résultat</RedButton>
          </form>
        )}
      </Card>
    </Layout>
  );
}
