import fs from "node:fs";

const filePath = "/home/ubuntu/mondo-coffee-website/client/src/pages/Home.tsx";
let source = fs.readFileSync(filePath, "utf8");

const componentImport = 'import ScrollSequenceHero from "@/components/ScrollSequenceHero";\nimport { mondoSequenceFrames } from "@/data/mondoSequenceFrames";\n';
if (!source.includes(componentImport)) {
  source = source.replace('import { Streamdown } from "streamdown";\n', 'import { Streamdown } from "streamdown";\n' + componentImport);
}

const heroPattern = /      \{\/\* Hero Section \*\/\}[\s\S]*?      \{\/\* About Section \*\/\}/;
const replacement = `      {/* Hero Section */}\n      <ScrollSequenceHero frameUrls={mondoSequenceFrames} />\n\n      {/* About Section */}`;
if (!heroPattern.test(source)) {
  throw new Error("Hero section marker was not found");
}
source = source.replace(heroPattern, replacement);
fs.writeFileSync(filePath, source);
