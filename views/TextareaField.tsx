interface TextareaFieldProps {
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  rows?: number;
}

export function TextareaField({
  id,
  name,
  label,
  placeholder,
  rows = 4,
}: TextareaFieldProps) {
  return (
    <div>
      <label for={id} class="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        placeholder={placeholder}
        rows={rows}
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all resize-none"
      />
    </div>
  );
}
