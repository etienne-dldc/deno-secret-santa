import { PropsWithChildren } from "hono/jsx";
import { Html } from "./Html.tsx";

export function Layout(props: PropsWithChildren) {
  return (
    <Html>
      {props.children}
    </Html>
  );
}
