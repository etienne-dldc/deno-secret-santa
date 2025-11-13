import { Card } from "../components/Card.tsx";
import { Layout } from "../components/Layout.tsx";

export function NotFound() {
  return (
    <Layout>
      <Card>
        <h1 class="text-4xl font-bold text-gray-800 mb-4">404</h1>
        <p class="text-xl text-gray-600 mb-6">Page non trouvée.</p>
        <a href="/" class="text-blue-500 hover:text-blue-700 underline">
          Retour à l'accueil
        </a>
      </Card>
    </Layout>
  );
}
