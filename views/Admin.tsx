import { Card } from "../components/Card.tsx";
import { Layout } from "../components/Layout.tsx";
import { Link } from "../components/Link.tsx";
import { TProject } from "../logic/types.ts";

interface AdminProps {
  projects?: TProject[];
  invalidPassword?: boolean;
}

export function Admin({ projects, invalidPassword }: AdminProps) {
  return (
    <Layout>
      <Card>
        <h1 class="text-3xl font-bold text-gray-800">Admin</h1>
        
        {!projects ? (
          <form method="POST" class="flex flex-col gap-4">
            <input type="hidden" name="action" value="adminLogin" />
            
            {invalidPassword && (
              <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                Mot de passe invalide
              </div>
            )}
            
            <div class="flex flex-col gap-2">
              <label for="password" class="text-sm font-medium text-gray-700">
                Mot de passe admin
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                class="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            
            <button
              type="submit"
              class="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
            >
              Se connecter
            </button>
          </form>
        ) : (
          <div class="flex flex-col gap-4">
            <h2 class="text-xl font-bold text-gray-800">Tous les projets</h2>
            
            {projects.length === 0 ? (
              <div class="bg-gray-100 rounded-lg p-4 text-gray-700">
                <p>Aucun projet n'a encore été créé.</p>
              </div>
            ) : (
              <ul class="flex flex-col gap-2">
                {projects.map((project) => (
                  <li key={project.id} class="flex flex-col gap-1 bg-white border border-gray-200 rounded-lg p-3">
                    <div class="font-semibold text-gray-900">{project.name}</div>
                    <div class="text-sm text-gray-600">
                      ID: <Link href={`/${project.id}`}>{project.id}</Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </Card>
    </Layout>
  );
}
