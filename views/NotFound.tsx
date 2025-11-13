import { Card } from "../components/Card.tsx";
import { Layout } from "../components/Layout.tsx";
import { Link } from "../components/Link.tsx";

export function NotFound() {
  return (
    <Layout>
      <Card>
        <h1 class="text-3xl font-bold text-gray-800">404</h1>
        <p class="text-xl text-gray-600">Page non trouvée.</p>
        <Link href="/">Retour à l'accueil</Link>
      </Card>
    </Layout>
  );
}
