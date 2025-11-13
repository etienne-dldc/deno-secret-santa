import { Card } from "../components/Card.tsx";
import { Layout } from "../components/Layout.tsx";
import { Link } from "../components/Link.tsx";
import { RedButton } from "../components/RedButton.tsx";
import { TProject, TUser } from "../logic/types.ts";

interface ProjectProps {
  project: TProject;
  users: TUser[];
}

export function Project({ project, users }: ProjectProps) {
  return (
    <Layout>
      <Card>
        <h1 class="text-3xl font-bold">{project.name}</h1>
        {users.length === 0 ? (
          <div class="bg-gray-100 rounded-lg p-4 text-gray-700">
            <p>Aucun participant n'a encore été ajouté.</p>
          </div>
        ) : (
          <ul class="flex flex-col gap-2">
            {users.map((user) => (
              <UserListItem user={user} />
            ))}
          </ul>
        )}
        {project.assignments === null ? (
          <>
            <Link href={`/${project.id}/nouveau-participant`}>
              Ajouter un participant
            </Link>
            <div class="flex flex-col gap-1">
              <RedButton
                href={`/${project.id}/tirage-au-sort`}
                disabled={users.length < 2}
              >
                Lancer le tirage au sort
              </RedButton>
              {users.length < 2 && (
                <p class="text-sm text-gray-600 text-center">
                  Il faut au moins 2 participants pour lancer le tirage au sort.
                </p>
              )}
            </div>
          </>
        ) : (
          <div class="flex flex-col gap-2">
            <h2 class="text-xl font-bold">Tirage au sort</h2>
            <p>Le tirage au sort a déjà été effectué pour ce projet.</p>
            <Link href={`/${project.id}/resultats`}>Voir les résultats</Link>
          </div>
        )}
      </Card>
    </Layout>
  );
}

function UserListItem({ user }: { user: TUser }) {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <li key={user.id} class="flex items-center gap-3 bg-white">
      <div class="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold">
        {initials}
      </div>
      <div class="text-gray-900 font-medium">{user.name}</div>
    </li>
  );
}
