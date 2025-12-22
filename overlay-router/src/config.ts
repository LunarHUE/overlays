import fs from "fs";
import path from "path";
import type { OverlayToolConfig } from "./types";

export function loadConfig(cwd: string = process.cwd()): OverlayToolConfig {
  const configPath = path.join(cwd, "overlay.config.json");
  if (!fs.existsSync(configPath)) {
    const defaultConfig = fs.readFileSync(
      path.join(__dirname, "../overlay.config.json"),
      "utf-8"
    );
    fs.writeFileSync(configPath, defaultConfig);
    return JSON.parse(defaultConfig);
  }

  return JSON.parse(fs.readFileSync(configPath, "utf-8"));
}
