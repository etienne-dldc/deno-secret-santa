import { PropsWithChildren } from "hono/jsx";

export function Card(props: PropsWithChildren) {
  return <div class="bg-white rounded-lg shadow-md p-6">{props.children}</div>;
}
