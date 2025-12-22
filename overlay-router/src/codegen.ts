import ts from "typescript";
import fs from "fs";
import path from "path";
import { loadConfig } from './config';

interface OverlayInfo {
  overlayPath: string;
  dataType: string;
  importPath: string;
  componentName: string; // Safe component name for imports
}

const config = loadConfig();
const GENERATED_DIR = config.generatedDir;

const overlays: Record<string, OverlayInfo> = {};

export function generateOverlayTypes(filePath: string) {
  const relPath = path.relative(config.overlaysDir, filePath).replace(/\\/g, "/");
  const overlayPath = relPath.replace(/\.(tsx|ts)$/, "");

  const sourceFile = ts.createSourceFile(
    filePath,
    fs.readFileSync(filePath, "utf-8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  );

  let dataType = "any";

  // Walk the AST to find the default export function/component
  ts.forEachChild(sourceFile, node => {
    // Handle: export default function Component(props: OverlayProps<...>) {}
    if (ts.isFunctionDeclaration(node) && node.modifiers?.some(m => m.kind === ts.SyntaxKind.DefaultKeyword)) {
      if (node.parameters.length > 0) {
        const param = node.parameters[0];
        if (param && param.type && ts.isTypeReferenceNode(param.type)) {
          const typeName = param.type.typeName.getText();
          if (typeName === "OverlayProps" && param.type.typeArguments?.length) {
            const typeArguments = param.type.typeArguments;
            dataType = typeArguments[0]?.getText() || "any";
          }
        }
      }
    }

    // Handle: export default const Component: FC<OverlayProps<...>> = () => {}
    if (ts.isVariableStatement(node)) {
      node.declarationList.declarations.forEach(decl => {
        if (node.modifiers?.some(m => m.kind === ts.SyntaxKind.DefaultKeyword)) {
          if (decl.type && ts.isTypeReferenceNode(decl.type)) {
            const typeName = decl.type.typeName.getText();
            if (
              (typeName === "FC" || typeName === "FunctionComponent") &&
              decl.type.typeArguments?.length
            ) {
              const fcArg = decl.type.typeArguments[0];
              if (fcArg && ts.isTypeReferenceNode(fcArg)) {
                const overlayName = fcArg.typeName.getText();
                if (
                  overlayName === "OverlayProps" &&
                  fcArg.typeArguments?.length
                ) {
                  dataType = fcArg.typeArguments[0]?.getText() || "any";
                }
              }
            }
            else if (
              typeName === "OverlayProps" &&
              decl.type.typeArguments?.length
            ) {
              dataType = decl.type.typeArguments[0]?.getText() || "any";
            }
          }
        }
      });
    }
  });

  // Generate a safe component name
  const componentName = overlayPath
    .split('/')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('') + 'Overlay';

  overlays[overlayPath] = {
    overlayPath,
    dataType,
    importPath: path.relative(GENERATED_DIR, filePath).replace(/\\/g, "/"),
    componentName
  };

  generateAllFiles();
}

function generateAllFiles() {
  if (!fs.existsSync(GENERATED_DIR)) {
    fs.mkdirSync(GENERATED_DIR, { recursive: true });
  }

  generateTypeDefinitions();
  generateRouter();
  generateServeOverlay();
  generateHooks();
  generateConstants();
  generateIndex();
  updateNextEnv();
}

// Generate d.ts file with type definitions
function generateTypeDefinitions() {
  const lines: string[] = [];
  lines.push("// THIS FILE IS AUTO-GENERATED. DO NOT EDIT.");
  lines.push("");

  // Import all data types
  Object.values(overlays).forEach(o => {
    lines.push(`import type { ${o.dataType} } from "${o.importPath}";`);
  });

  lines.push("");
  lines.push("declare global {");
  lines.push("  interface OverlayMap {");
  Object.values(overlays).forEach(o => {
    lines.push(`    "${o.overlayPath}": ${o.dataType};`);
  });
  lines.push("  }");
  lines.push("");
  lines.push("  interface OverlayProps<T> {");
  lines.push("    data: T;");
  lines.push("    onClose?: () => void;");
  lines.push("  }");
  lines.push("}");
  lines.push("");
  lines.push("export type OverlayPath = keyof OverlayMap;");
  lines.push("");
  lines.push("export {};");

  fs.writeFileSync(path.join(GENERATED_DIR, "overlays.d.ts"), lines.join("\n"), "utf-8");
}

// Generate router.tsx
function generateRouter() {
  const lines: string[] = [];
  lines.push(`// THIS FILE IS AUTO-GENERATED. DO NOT EDIT.`);
  lines.push(`"use client";`);
  lines.push(``);
  lines.push(`import { useSearchParams } from "next/navigation";`);
  lines.push(`import { ServeOverlay } from "./serve-overlay";`);
  lines.push(``);
  lines.push(`export function OverlayRouter() {`);
  lines.push(`  const searchParams = useSearchParams();`);
  lines.push(``);
  lines.push(`  const overlayParam = searchParams.get("overlay");`);
  lines.push(`  const dataParam = searchParams.get("data");`);
  lines.push(``);
  lines.push(`  if (!overlayParam) return null;`);
  lines.push(``);
  lines.push(`  // Format: "o:path/to/overlay"`);
  lines.push(`  const overlayName = overlayParam.split(":")[1];`);
  lines.push(`  if (!overlayName) return null;`);
  lines.push(``);
  lines.push(`  let overlayData = {};`);
  lines.push(`  if (dataParam) {`);
  lines.push(`    try {`);
  lines.push(`      // Decode base64 and parse JSON`);
  lines.push(`      overlayData = JSON.parse(atob(dataParam));`);
  lines.push(`    } catch (e) {`);
  lines.push(`      console.error("Failed to parse overlay data:", e);`);
  lines.push(`    }`);
  lines.push(`  }`);
  lines.push(``);
  lines.push(`  return <ServeOverlay overlayName={overlayName} data={overlayData} />;`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`export default OverlayRouter;`);

  fs.writeFileSync(path.join(GENERATED_DIR, "router.tsx"), lines.join("\n"), "utf-8");
}

// Generate serve-overlay.tsx
function generateServeOverlay() {
  const lines: string[] = [];
  lines.push(`// THIS FILE IS AUTO-GENERATED. DO NOT EDIT.`);
  lines.push(`"use client";`);
  lines.push(``);
  lines.push(`import React, { Suspense, lazy, useMemo } from "react";`);
  lines.push(`import { useOverlayActions } from "./hooks";`);
  lines.push(``);

  // Import all overlay components
  Object.values(overlays).forEach(o => {
    const importPathWithoutExt = o.importPath.replace(/\.(tsx|ts)$/, "");
    lines.push(`import ${o.componentName} from "${importPathWithoutExt}";`);
  });

  lines.push(``);
  lines.push(`// Map of overlay names to components`);
  lines.push(`const overlayComponents = {`);
  Object.values(overlays).forEach(o => {
    lines.push(`  "${o.overlayPath}": ${o.componentName},`);
  });
  lines.push(`} as const;`);

  lines.push(``);
  lines.push(`// Lazy-loaded versions for code splitting (optional)`);
  lines.push(`const lazyOverlayComponents = {`);
  Object.values(overlays).forEach(o => {
    const importPathWithoutExt = o.importPath.replace(/\.(tsx|ts)$/, "");
    lines.push(`  "${o.overlayPath}": lazy(() => import("${importPathWithoutExt}")),`);
  });
  lines.push(`} as const;`);

  lines.push(``);
  lines.push(`interface ServeOverlayProps {`);
  lines.push(`  overlayName: string;`);
  lines.push(`  data?: any;`);
  lines.push(`  lazy?: boolean;`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`export function ServeOverlay({ overlayName, data, lazy = false }: ServeOverlayProps) {`);
  lines.push(`  const { closeOverlay } = useOverlayActions();`);
  lines.push(``);
  lines.push(`  const Component = useMemo(() => {`);
  lines.push(`    const components = lazy ? lazyOverlayComponents : overlayComponents;`);
  lines.push(`    return components[overlayName as keyof typeof components];`);
  lines.push(`  }, [overlayName, lazy]);`);
  lines.push(``);
  lines.push(`  if (!Component) {`);
  lines.push(`    console.error(\`Overlay "\${overlayName}" not found\`);`);
  lines.push(`    return null;`);
  lines.push(`  }`);
  lines.push(``);
  lines.push(`  const content = <Component data={data} onClose={closeOverlay} />;`);
  lines.push(``);
  lines.push(`  if (lazy) {`);
  lines.push(`    return (`);
  lines.push(`      <Suspense fallback={<div>Loading overlay...</div>}>`);
  lines.push(`        {content}`);
  lines.push(`      </Suspense>`);
  lines.push(`    );`);
  lines.push(`  }`);
  lines.push(``);
  lines.push(`  return content;`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`export default ServeOverlay;`);

  fs.writeFileSync(path.join(GENERATED_DIR, "serve-overlay.tsx"), lines.join("\n"), "utf-8");
}

// Generate hooks.ts
function generateHooks() {
  const lines: string[] = [];
  lines.push(`// THIS FILE IS AUTO-GENERATED. DO NOT EDIT.`);
  lines.push(`"use client";`);
  lines.push(``);
  lines.push(`import { useRouter, useSearchParams, usePathname } from "next/navigation";`);
  lines.push(`import { useCallback, useMemo } from "react";`);
  lines.push(``);
  lines.push(`/**`);
  lines.push(` * Hook to manage overlay state through URL search params`);
  lines.push(` */`);
  lines.push(`export function useOverlay() {`);
  lines.push(`  const router = useRouter();`);
  lines.push(`  const pathname = usePathname();`);
  lines.push(`  const searchParams = useSearchParams();`);
  lines.push(``);
  lines.push(`  const currentOverlay = useMemo(() => {`);
  lines.push(`    const overlayParam = searchParams.get("overlay");`);
  lines.push(`    if (!overlayParam) return null;`);
  lines.push(``);
  lines.push(`    const overlayName = overlayParam.split(":")[1];`);
  lines.push(`    const dataParam = searchParams.get("data");`);
  lines.push(``);
  lines.push(`    let data = undefined;`);
  lines.push(`    if (dataParam) {`);
  lines.push(`      try {`);
  lines.push(`        data = JSON.parse(atob(dataParam));`);
  lines.push(`      } catch (e) {`);
  lines.push(`        console.error("Failed to parse overlay data:", e);`);
  lines.push(`      }`);
  lines.push(`    }`);
  lines.push(``);
  lines.push(`    return { name: overlayName, data };`);
  lines.push(`  }, [searchParams]);`);
  lines.push(``);
  lines.push(`  const openOverlay = useCallback(`);
  lines.push(`    <K extends keyof OverlayMap>(`);
  lines.push(`      name: K,`);
  lines.push(`      data?: OverlayMap[K],`);
  lines.push(`      options?: { replace?: boolean }`);
  lines.push(`    ) => {`);
  lines.push(`      const params = new URLSearchParams(searchParams.toString());`);
  lines.push(`      params.set("overlay", \`o:\${name}\`);`);
  lines.push(``);
  lines.push(`      if (data !== undefined) {`);
  lines.push(`        // Encode data as base64 JSON`);
  lines.push(`        params.set("data", btoa(JSON.stringify(data)));`);
  lines.push(`      } else {`);
  lines.push(`        params.delete("data");`);
  lines.push(`      }`);
  lines.push(``);
  lines.push(`      const url = \`\${pathname}?\${params.toString()}\`;`);
  lines.push(`      `);
  lines.push(`      if (options?.replace) {`);
  lines.push(`        router.replace(url);`);
  lines.push(`      } else {`);
  lines.push(`        router.push(url);`);
  lines.push(`      }`);
  lines.push(`    },`);
  lines.push(`    [router, pathname, searchParams]`);
  lines.push(`  );`);
  lines.push(``);
  lines.push(`  const closeOverlay = useCallback(`);
  lines.push(`    (options?: { replace?: boolean }) => {`);
  lines.push(`      const params = new URLSearchParams(searchParams.toString());`);
  lines.push(`      params.delete("overlay");`);
  lines.push(`      params.delete("data");`);
  lines.push(``);
  lines.push(`      const url = params.toString() ? \`\${pathname}?\${params.toString()}\` : pathname;`);
  lines.push(``);
  lines.push(`      if (options?.replace) {`);
  lines.push(`        router.replace(url);`);
  lines.push(`      } else {`);
  lines.push(`        router.push(url);`);
  lines.push(`      }`);
  lines.push(`    },`);
  lines.push(`    [router, pathname, searchParams]`);
  lines.push(`  );`);
  lines.push(``);
  lines.push(`  const updateOverlayData = useCallback(`);
  lines.push(`    <K extends keyof OverlayMap>(data: OverlayMap[K]) => {`);
  lines.push(`      const params = new URLSearchParams(searchParams.toString());`);
  lines.push(`      params.set("data", btoa(JSON.stringify(data)));`);
  lines.push(`      router.replace(\`\${pathname}?\${params.toString()}\`);`);
  lines.push(`    },`);
  lines.push(`    [router, pathname, searchParams]`);
  lines.push(`  );`);
  lines.push(``);
  lines.push(`  return {`);
  lines.push(`    currentOverlay,`);
  lines.push(`    openOverlay,`);
  lines.push(`    closeOverlay,`);
  lines.push(`    updateOverlayData,`);
  lines.push(`    isOpen: currentOverlay !== null,`);
  lines.push(`  };`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`/**`);
  lines.push(` * Hook for overlay actions (used inside overlay components)`);
  lines.push(` */`);
  lines.push(`export function useOverlayActions() {`);
  lines.push(`  const { closeOverlay, updateOverlayData } = useOverlay();`);
  lines.push(`  return { closeOverlay, updateOverlayData };`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`/**`);
  lines.push(` * Hook to check if a specific overlay is open`);
  lines.push(` */`);
  lines.push(`export function useIsOverlayOpen(name: keyof OverlayMap) {`);
  lines.push(`  const { currentOverlay } = useOverlay();`);
  lines.push(`  return currentOverlay?.name === name;`);
  lines.push(`}`);

  fs.writeFileSync(path.join(GENERATED_DIR, "hooks.ts"), lines.join("\n"), "utf-8");
}

// Generate constants.ts with overlay paths
function generateConstants() {
  const lines: string[] = [];
  lines.push(`// THIS FILE IS AUTO-GENERATED. DO NOT EDIT.`);
  lines.push(``);
  lines.push(`/**`);
  lines.push(` * Overlay paths as constants for easier imports and refactoring`);
  lines.push(` */`);
  lines.push(`export const OVERLAYS = {`);
  Object.values(overlays).forEach(o => {
    const constName = o.overlayPath
      .toUpperCase()
      .replace(/[\/\-]/g, '_');
    lines.push(`  ${constName}: "${o.overlayPath}" as const,`);
  });
  lines.push(`} as const;`);
  lines.push(``);
  lines.push(`export type OverlayKey = typeof OVERLAYS[keyof typeof OVERLAYS];`);

  fs.writeFileSync(path.join(GENERATED_DIR, "constants.ts"), lines.join("\n"), "utf-8");
}

function generateIndex() {
  const lines: string[] = [];
  lines.push(`// THIS FILE IS AUTO-GENERATED. DO NOT EDIT.`);
  lines.push(``);
  lines.push(`export { OverlayRouter } from "./router";`);
  lines.push(`export { ServeOverlay } from "./serve-overlay";`);
  lines.push(`export { useOverlay, useOverlayActions, useIsOverlayOpen } from "./hooks";`);
  lines.push(`export { OVERLAYS, type OverlayKey } from "./constants";`);
  lines.push(`export type { OverlayPath } from "./overlays";`);

  fs.writeFileSync(path.join(GENERATED_DIR, "index.ts"), lines.join("\n"), "utf-8");
}

// Update next-env.d.ts
function updateNextEnv() {
  const typeReferenceLine = `/// <reference path="${path.relative(process.cwd(), path.join(GENERATED_DIR, "overlays.d.ts"))}" />`;

  const nextEnvPath = path.resolve("next-env.d.ts");
  if (!fs.existsSync(nextEnvPath)) {
    console.log("next-env.d.ts not found, skipping reference update");
    return;
  }

  let content = fs.readFileSync(nextEnvPath, "utf-8");
  const linesArr = content.split(/\r?\n/);

  if (!linesArr.includes(typeReferenceLine)) {
    let insertIndex = 0;
    while (linesArr[insertIndex]?.startsWith("///")) {
      insertIndex++;
    }
    linesArr.splice(insertIndex, 0, typeReferenceLine);
    fs.writeFileSync(nextEnvPath, linesArr.join("\n"), "utf-8");
    console.log("Added reference to generated overlay types in next-env.d.ts");
  }
}

export function generateIntentTypes(filePath: string) {
  console.log("Generating intent types for", filePath);
}