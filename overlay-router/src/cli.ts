import { loadConfig } from "./config.js";
import { watchFolder } from "./watcher.js";
import { generateOverlayTypes, generateIntentTypes } from "./codegen.js";

function main() {
  const config = loadConfig(process.cwd());

  console.log("Watching overlays and intents...");

  watchFolder(config.overlaysDir, "Overlay", generateOverlayTypes);
  watchFolder(config.intentsDir, "Intent", generateIntentTypes);
}

main();
