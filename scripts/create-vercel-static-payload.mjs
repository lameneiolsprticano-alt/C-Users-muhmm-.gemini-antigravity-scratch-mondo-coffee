import fs from "node:fs";
import path from "node:path";

const root = path.resolve("dist/public");
const output = path.resolve("vercel-static-payload.json");
const teamId = "team_4ZzsVG8tNUf74Pzi9tgkrWhP";

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(absolute) : [absolute];
  });
}

const files = walk(root).map((absolute) => {
  const relative = path.relative(root, absolute).split(path.sep).join("/");
  const contents = fs.readFileSync(absolute);
  const isText = /\.(?:html|css|js|json|txt|svg)$/i.test(relative);

  return isText
    ? { file: relative, data: contents.toString("utf8") }
    : { file: relative, data: contents.toString("base64"), encoding: "base64" };
});

fs.writeFileSync(
  output,
  JSON.stringify(
    {
      name: "mondo-coffee",
      target: "preview",
      teamId,
      files,
    },
    null,
    2,
  ),
);

console.log(`Prepared ${files.length} static Vercel files in ${output}`);
