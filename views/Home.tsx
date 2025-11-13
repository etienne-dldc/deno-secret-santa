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
    </Layout>
  );
}
