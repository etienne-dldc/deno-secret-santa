import { PropsWithChildren } from "hono/jsx";

export function Card(props: PropsWithChildren<{ class?: string }>) {
  return (
    <div
      class={`bg-white rounded-lg shadow-md p-6 flex flex-col gap-4 ${
        props.class ?? ""
      }`}
    >
      {props.children}
    </div>
  );
}
