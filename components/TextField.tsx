interface TextFieldProps {
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
}

export function TextField({
  id,
  name,
  label,
  placeholder,
  required = false,
  type = "text",
}: TextFieldProps) {
  return (
    <div>
      <label for={id} class="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        required={required}
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
      />
    </div>
  );
}
