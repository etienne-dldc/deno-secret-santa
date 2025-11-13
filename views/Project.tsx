import { Card } from "../components/Card.tsx";
import { Layout } from "../components/Layout.tsx";
import { RedButton } from "../components/RedButton.tsx";
import { TProject, TUser } from "../logic/types.ts";

interface ProjectProps {
  project: TProject;
  users: TUser[];
}

export function Project({ project, users }: ProjectProps) {
  return (
    <Layout>
      <Card class="flex flex-col gap-4">
        <h1 class="text-3xl font-bold">{project.name}</h1>
        {users.length === 0 ? (
          <div class="bg-gray-100 rounded-lg p-4 text-gray-700">
            <p>Aucun participant n'a encore été ajouté.</p>
          </div>
        ) : (
          <ul class="list-disc list-inside">
            {users.map((user) => (
              <li key={user.id} class="text-gray-700">
                {user.name}
              </li>
            ))}
          </ul>
        )}
        {project.assignments === null ? (
          <>
            <a
              href={`/${project.id}/nouveau-participant`}
              class="text-blue-500 hover:text-blue-700 underline"
            >
              Ajouter un participant
            </a>
            <RedButton href={`/${project.id}/tirage-au-sort`}>
              Lancer le tirage au sort
            </RedButton>
          </>
        ) : (
          <div>TODO</div>
        )}
      </Card>
    </Layout>
  );
}
