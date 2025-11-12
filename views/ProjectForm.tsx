import { RedButton } from "./RedButton.tsx";
import { TextField } from "./TextField.tsx";
import { TextareaField } from "./TextareaField.tsx";

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

      <TextareaField
        id="description"
        name="description"
        label="Description"
        placeholder="Ajoutez des détails sur cet échange de cadeaux..."
        rows={4}
      />

      <RedButton type="submit">✨ Créer un projet</RedButton>
    </form>
  );
}
