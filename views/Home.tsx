import { Card } from "../components/Card.tsx";
import { Layout } from "../components/Layout.tsx";
import { ProjectForm } from "../components/ProjectForm.tsx";

export function Home() {
  return (
    <Layout>
      <Card>
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Créer un projet</h2>
        <ProjectForm />
      </Card>
    </Layout>
  );
}
