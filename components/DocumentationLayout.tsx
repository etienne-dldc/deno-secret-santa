import { PropsWithChildren } from "hono/jsx";
import { Html } from "./Html.tsx";

export function DocumentationLayout(props: PropsWithChildren) {
  return (
    <Html title="Documentation" maxWidth="max-w-[500px] md:max-w-[900px]">
      {props.children}
    </Html>
  );
}
