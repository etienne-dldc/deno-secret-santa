import { TProject, TUser } from "../logic/types.ts";
import { Card } from "./Card.tsx";
import { Layout } from "./Layout.tsx";

interface ProjectProps {
  project: TProject;
  users: TUser[];
}

export function Project({ project, users }: ProjectProps) {
  return (
    <Layout>
      <Card>
        <h1 class="text-3xl font-bold">{project.name}</h1>
        {project.description && <p class="mt-4">{project.description}</p>}
      </Card>
      <Card>
        <h2 class="text-2xl font-bold mb-4">Users</h2>
        {users.length === 0 ? (
          <p>No users found for this project.</p>
        ) : (
          <ul class="list-disc list-inside">
            {users.map((user) => (
              <li key={user.id} class="text-gray-700">
                {user.name}
              </li>
            ))}
          </ul>
        )}
      </Card>
      {project.assignments === null ? (
        <Card>User Form</Card>
      ) : (
        <Card>Assignments have been made. Reveal.</Card>
      )}
    </Layout>
  );
}
