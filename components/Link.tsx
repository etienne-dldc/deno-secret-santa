import { PropsWithChildren } from "hono/jsx";

export function Link({ href, children }: PropsWithChildren<{ href: string }>) {
  return (
    <a href={href} class="text-blue-500 hover:text-blue-700 underline">
      {children}
    </a>
  );
}
