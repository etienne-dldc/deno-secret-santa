import { Card } from "../components/Card.tsx";
import { Layout } from "../components/Layout.tsx";
import { UserForm } from "./UserForm.tsx";

export function AddUser() {
  return (
    <Layout>
      <Card>
        <h2 class="text-2xl font-bold text-gray-800 mb-6">
          Ajouter un utilisateur
        </h2>
        <UserForm />
      </Card>
    </Layout>
  );
}
