import { readFile, writeFile } from "node:fs/promises";
import { access } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL(".", import.meta.url)), "..");
const source = resolve(root, "../01_plan/TestStrategy_Template.md");
const target = resolve(root, "src/backend/template.generated.mjs");

try {
  await access(source);
} catch {
  console.log("Source template not present (deployed build) — keeping the committed generated file.");
  process.exit(0);
}

const markdown = await readFile(source, "utf8");
const contents = `// GENERATED from ../01_plan/TestStrategy_Template.md by scripts/sync-template.mjs — do not edit.
export const TEMPLATE_MARKDOWN = ${JSON.stringify(markdown)};
`;

await writeFile(target, contents, "utf8");
console.log(`Synced template (${markdown.length} chars) -> src/backend/template.generated.mjs`);
