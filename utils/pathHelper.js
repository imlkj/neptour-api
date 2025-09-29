import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 👇 This helper resolves paths relative to your *project root*
export const resolvePath = (...segments) => {
  return path.join(process.cwd(), ...segments);
};

// 👇 This one resolves relative to the current file’s directory
export const resolveLocalPath = (...segments) => {
  return path.join(__dirname, ...segments);
};
