import chokidar from "chokidar";
import path from "path";

export function watchFolder(folder: string, label: string, onChange: (file: string) => void) {
  const watcher = chokidar.watch(folder, {
    ignoreInitial: false,
    persistent: true
  });

  watcher.on("add", filePath => {
    onChange(filePath);
    console.log(`[${label}] Added: ${path.relative(process.cwd(), filePath)}`);
  });

  watcher.on("change", filePath => {
    onChange(filePath);
    console.log(`[${label}] Changed: ${path.relative(process.cwd(), filePath)}`);
  });

  watcher.on("unlink", filePath => {
    onChange(filePath);
    console.log(`[${label}] Removed: ${path.relative(process.cwd(), filePath)}`);
  });

  return watcher;
}
