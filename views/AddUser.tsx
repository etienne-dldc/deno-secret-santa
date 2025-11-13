import { Card } from "../components/Card.tsx";
import { Layout } from "../components/Layout.tsx";
import { Link } from "../components/Link.tsx";
import { UserForm } from "../components/UserForm.tsx";
import { TProject } from "../logic/types.ts";

interface AddUserProps {
  project: TProject;
  error?: string;
}

export function AddUser({ project, error }: AddUserProps) {
  return (
    <Layout>
      <Card>
        <Link href={`/${project.id}`}>
          &larr; Retour à <em class="font-bold not-italic">{project.name}</em>
        </Link>
        <h2 class="text-2xl font-bold text-gray-800">Ajouter un participant</h2>
        {error && (
          <div class="bg-red-50 border border-red-200 rounded-lg p-4">
            <p class="text-red-600 text-sm">{error}</p>
          </div>
        )}
        <UserForm />
      </Card>
    </Layout>
  );
}
