import { PropsWithChildren } from "hono/jsx";

export function Layout(props: PropsWithChildren) {
  return (
    <html lang="fr" class="h-full bg-red-600">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href={`data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🎅</text></svg>`} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Secret Santa - Etienne.tech</title>
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
        {/* Privacy-friendly analytics by Plausible */}
        <script async src="https://plausible.io/js/pa-LL0zZi6rlFwr9BhSLdTDk.js"></script>
        <script>
          {`window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()`}
        </script>
      </head>
      <body class="h-full">
        <div class="max-w-[500px] mx-auto min-h-[100dvh] grid p-2 md:p-4">
          <div class="self-center flex flex-col gap-4">
            <div class="flex flex-col items-center gap-2">
              <h1 class="text-3xl md:text-5xl font-bold text-white mb-2 text-center">
                <a href="/">🎅 Secret Santa 🎅</a>
              </h1>
            </div>
            {props.children}
          </div>
          <footer class="self-end text-center text-white text-sm py-4">
            Réalisé par <a href="https://dldc.dev" target="_blank" rel="noopener noreferrer" class="underline hover:text-gray-200">Etienne</a> - <a href="https://github.com/etienne-dldc/deno-secret-santa" target="_blank" rel="noopener noreferrer" class="underline hover:text-gray-200">Code source</a>
          </footer>
        </div>
      </body>
    </html>
  );
}
