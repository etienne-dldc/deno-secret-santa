import { RedButton } from "./RedButton.tsx";
import { TextField } from "./TextField.tsx";
import { TextareaField } from "./TextareaField.tsx";

export function UserForm() {
  return (
    <form method="post" class="space-y-4">
      <input type="hidden" name="action" value="createUser" />

      <TextField
        id="name"
        name="name"
        label="Nom"
        placeholder="ex. : Jean Dupont"
        required
      />

      <TextareaField
        id="hint"
        name="hint"
        label="Indice"
        placeholder="ex. : J'aime les sports d'hiver..."
        rows={3}
      />

      <TextField
        id="password"
        name="password"
        label="Mot de passe"
        placeholder="Entrez votre mot de passe"
        type="password"
        required
      />

      <div class="text-sm text-gray-600 px-1">
        <p class="wrap-balance">
          ⚠️ En cas de perte, le mot de passe ne pourra pas être récupéré.
          Conservez-le en lieu sûr.
        </p>
      </div>

      <RedButton type="submit">✨ Je participe ! ✨</RedButton>
    </form>
  );
}
