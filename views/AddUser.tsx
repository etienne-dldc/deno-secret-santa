import { Card } from "../components/Card.tsx";
import { Layout } from "../components/Layout.tsx";
import { Link } from "../components/Link.tsx";
import { UserForm } from "../components/UserForm.tsx";
import { TProject } from "../logic/types.ts";

interface AddUserProps {
  project: TProject;
}

export function AddUser({ project }: AddUserProps) {
  return (
    <Layout>
      <Card>
        <Link href={`/${project.id}`}>
          &larr; Retour à <em class="font-bold not-italic">{project.name}</em>
        </Link>
        <h2 class="text-2xl font-bold text-gray-800">Ajouter un participant</h2>
        <UserForm />
      </Card>
    </Layout>
  );
}
