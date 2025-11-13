import { RedButton } from "./RedButton.tsx";
import { TextField } from "./TextField.tsx";

export function ProjectForm() {
  return (
    <form method="post" class="space-y-4">
      <input type="hidden" name="action" value="createProject" />

      <TextField
        id="name"
        name="name"
        label="Nom du projet"
        placeholder="ex. : Famille 2025"
        required
      />

      <TextField
        id="password"
        name="password"
        label="Mot de passe (optionnel)"
        placeholder="Laisser vide si non souhaité"
        type="password"
      />

      <div class="text-sm text-gray-600 px-1">
        <p class="wrap-balance">
          Ce mot de passe sera necessaire pour lancer le tirage au sort. Laisser vide pour que n'importe qui avec le lien du projet puisse lancer le tirage au sort.
        </p>
      </div>

      <RedButton type="submit">✨ Créer un projet</RedButton>
    </form>
  );
}
