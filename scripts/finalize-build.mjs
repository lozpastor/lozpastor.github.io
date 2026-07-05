import { access, rename } from "node:fs/promises";
import path from "node:path";

const outputDirectory = path.resolve("dist");
const sourceEntry = path.join(outputDirectory, "source.html");
const publicEntry = path.join(outputDirectory, "index.html");

await access(sourceEntry);
await rename(sourceEntry, publicEntry);
