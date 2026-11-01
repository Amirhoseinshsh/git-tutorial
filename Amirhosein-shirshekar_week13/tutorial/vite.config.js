import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// خروجی build را طوری تنظیم می‌کند که با دابل‌کلیک روی dist/index.html (file://) هم کار کند
function fileProtocolFix() {
  return {
    name: "file-protocol-fix",
    transformIndexHtml: {
      order: "post",
      handler(html) {
        const m = html.match(/<script type="module" crossorigin src="([^"]+)"><\/script>/);
        let out = html.replace(/ crossorigin/g, "");
        if (!m) return out;
        out = out.replace(/<script type="module" src="[^"]+"><\/script>/, "");
        return out.replace("</body>", `<script src="${m[1]}"></script>\n</body>`);
      },
    },
  };
}

export default defineConfig({
  base: "./",
  plugins: [react(), fileProtocolFix()],
  build: {
    rollupOptions: {
      output: { format: "iife", inlineDynamicImports: true },
    },
  },
});
