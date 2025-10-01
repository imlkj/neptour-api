import dotenv from "dotenv";
import { resolvePath } from "./utils/pathHelper.js";
dotenv.config({ path: resolvePath("config.env") });
