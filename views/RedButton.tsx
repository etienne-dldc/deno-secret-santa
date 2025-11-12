import { Child } from "hono/jsx";

interface RedButtonProps {
  type?: "button" | "submit" | "reset";
  children: Child;
  onClick?: () => void;
}

export function RedButton({
  type = "button",
  children,
  onClick,
}: RedButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      class="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg cursor-pointer"
    >
      {children}
    </button>
  );
}
