import { Card } from "../components/Card.tsx";
import { Layout } from "../components/Layout.tsx";
import { ProjectForm } from "../components/ProjectForm.tsx";

export function Home() {
  return (
    <Layout>
      <Card>
        <h1 class="text-3xl font-bold text-gray-800">Créer un projet</h1>
        <ProjectForm />
      </Card>
      <Card>
        <div class="text-center">
          <p class="text-gray-700 mb-3">
            Besoin d'aide pour utiliser l'application ?
          </p>
          <a 
            href="/documentation" 
            class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            📚 Consulter la documentation
          </a>
        </div>
      </Card>
    </Layout>
  );
}
