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

      <div class="[&>div]:hidden [&:has(input:checked)>div]:block">
        <label for="toggle-password" class="flex items-center space-x-2 cursor-pointer px-1">
          <input id="toggle-password" name="enablePassword" type="checkbox" value="true" class="rounded" />
          <span class="text-sm font-semibold text-gray-700">Mot de passe administrateur</span>
        </label>
        <div class="mt-4 space-y-2">
          <TextField
            id="password"
            name="password"
            label="Mot de passe"
            placeholder="Entrez un mot de passe"
            type="password"
          />
          <div class="text-sm text-gray-600 px-1">
            <p class="wrap-balance">
              Ce mot de passe sera nécessaire pour lancer le tirage au sort et pour ajouter/supprimer des contraintes. Laisser cette case décochée pour que n'importe qui avec le lien du projet puisse lancer le tirage au sort.
            </p>
          </div>
        </div>
      </div>

      <RedButton type="submit">✨ Créer un projet</RedButton>
    </form>
  );
}
