import { PropsWithChildren } from "hono/jsx";

export function Layout(props: PropsWithChildren) {
  return (
    <html lang="fr" class="h-full bg-red-600">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Père Noël Secret</title>
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
      </head>
      <body class="h-full">
        <div class="max-w-[500px] mx-auto min-h-[100dvh] grid p-2 md:p-4">
          <div class="self-center flex flex-col gap-4">
            <div class="flex flex-col items-center gap-2">
              <h1 class="text-5xl font-bold text-white mb-2">
                <a href="/">🎅 Secret Santa 🎅</a>
              </h1>
            </div>
            {props.children}
          </div>
        </div>
      </body>
    </html>
  );
}
