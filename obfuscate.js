import { createRequire } from "module";
const require = createRequire(import.meta.url);
const obfuscator = require("javascript-obfuscator");
const fs = require("fs");
const path = require("path");
import { fileURLToPath } from "url";

// Workaround for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const buildPath = path.join(__dirname, "build", "static", "js");

fs.readdirSync(buildPath).forEach((file) => {
  // Only obfuscate main JS files, skip runtime & lazy-loaded chunks
  if (
    file.endsWith(".js") &&
    !file.startsWith("runtime") && 
    !file.includes("chunk") // Skip chunk files used by React.lazy()
  ) {
    const filePath = path.join(buildPath, file);
    const code = fs.readFileSync(filePath, "utf-8");

    const obfuscatedCode = obfuscator.obfuscate(code, {
      compact: true,
      controlFlowFlattening: false, // Prevents breaking dynamic imports
      stringArray: true,
      stringArrayEncoding: ["base64"],
      selfDefending: true,
      ignoreImports: true, // Ensures dynamic `import()` calls work
    }).getObfuscatedCode();

    fs.writeFileSync(filePath, obfuscatedCode, "utf-8");
  }
});

