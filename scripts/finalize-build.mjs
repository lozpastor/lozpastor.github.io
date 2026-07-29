import { access, copyFile, cp, mkdir, readdir, rename, rm } from "node:fs/promises";
import path from "node:path";

const outputDirectory = path.resolve("dist");
const sourceEntry = path.join(outputDirectory, "source.html");
const publicEntry = path.join(outputDirectory, "index.html");
const repositoryRoot = path.resolve(".");

await access(sourceEntry);
await rename(sourceEntry, publicEntry);

// GitHub Pages is currently configured with both the Actions workflow and the
// legacy branch publisher. Keep the committed branch output identical to dist
// so the later publisher cannot replace the current portfolio with stale files.
const outputEntries = await readdir(outputDirectory, { withFileTypes: true });

for (const entry of outputEntries) {
  const source = path.join(outputDirectory, entry.name);
  const destination = path.join(repositoryRoot, entry.name);

  if (entry.isDirectory()) {
    await rm(destination, { recursive: true, force: true });
    await mkdir(destination, { recursive: true });
    await cp(source, destination, { recursive: true });
  } else {
    await copyFile(source, destination);
  }
}
