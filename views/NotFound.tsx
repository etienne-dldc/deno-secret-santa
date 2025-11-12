import { Card } from "./Card.tsx";
import { Layout } from "./Layout.tsx";

export function NotFound() {
  return (
    <Layout>
      <Card>
        <div class="text-center">
          <h1 class="text-4xl font-bold text-gray-800 mb-4">404</h1>
          <p class="text-xl text-gray-600 mb-6">Page not found</p>
          <a href="/" class="text-blue-500 hover:text-blue-700 underline">
            Go back home
          </a>
        </div>
      </Card>
    </Layout>
  );
}
