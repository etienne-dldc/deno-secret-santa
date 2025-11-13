export function ShareableMessage({ text, path }: { text: string; path: string }) {
  return (
    <div class="bg-gray-100 rounded-lg p-4 border border-gray-300">
      <pre class="text-sm text-gray-800 overflow-x-auto whitespace-pre-wrap break-all">
        {text}: {path}
      </pre>
    </div>
  );
}
