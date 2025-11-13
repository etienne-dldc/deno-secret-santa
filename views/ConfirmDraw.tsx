import { Card } from "../components/Card.tsx";
import { Layout } from "../components/Layout.tsx";
import { Link } from "../components/Link.tsx";
import { RedButton } from "../components/RedButton.tsx";
import { TProject } from "../logic/types.ts";

interface ConfirmDrawProps {
  project: TProject;
}

export function ConfirmDraw({ project }: ConfirmDrawProps) {
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
        <form method="post">
          <RedButton type="submit">Confirmer le tirage au sort</RedButton>
        </form>
      </Card>
    </Layout>
  );
}
