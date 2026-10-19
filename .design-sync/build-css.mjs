// Compila .design-sync/ds.css com o Tailwind do proprio site (o mesmo
// @tailwindcss/postcss do postcss.config.mjs) em .design-sync/.cache/ds.css,
// que a config usa como cssEntry. Rodar da raiz do repo:
//   node .design-sync/build-css.mjs
// A deteccao automatica de classes do Tailwind parte da raiz e respeita o
// .gitignore: pega components/, app/ e .design-sync/previews/.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import postcss from "postcss";
import tailwind from "@tailwindcss/postcss";

const from = resolve(".design-sync/ds.css");
const to = resolve(".design-sync/.cache/ds.css");
const result = await postcss([tailwind({ base: process.cwd() })]).process(readFileSync(from, "utf8"), { from, to });
mkdirSync(resolve(".design-sync/.cache"), { recursive: true });
writeFileSync(to, result.css);
console.log(`ds.css: ${(result.css.length / 1024).toFixed(0)} KB -> ${to}`);
