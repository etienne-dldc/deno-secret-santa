import { Card } from "../components/Card.tsx";
import { Layout } from "../components/Layout.tsx";
import { Link } from "../components/Link.tsx";
import { RedButton } from "../components/RedButton.tsx";
import { TextField } from "../components/TextField.tsx";
import { TProject } from "../logic/types.ts";

interface ConfirmDrawProps {
  project: TProject;
  invalidPassword?: boolean;
}

export function ConfirmDraw({ project, invalidPassword }: ConfirmDrawProps) {
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
          <RedButton type="submit">Confirmer le tirage au sort</RedButton>
        </form>
      </Card>
    </Layout>
  );
}
