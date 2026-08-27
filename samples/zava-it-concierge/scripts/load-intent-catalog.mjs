import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import ts from 'typescript';

const require = createRequire(import.meta.url);

export async function loadIntentCatalog(projectRoot) {
  const catalogPath = path.join(projectRoot, 'src', 'shared', 'intents', 'intentCatalog.ts');
  const source = await readFile(catalogPath, 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022
    },
    fileName: catalogPath,
    reportDiagnostics: true
  });

  const errors = output.diagnostics?.filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error) ?? [];
  if (errors.length > 0) {
    throw new Error(ts.formatDiagnostics(errors, {
      getCanonicalFileName: (fileName) => fileName,
      getCurrentDirectory: () => projectRoot,
      getNewLine: () => '\n'
    }));
  }

  const module = { exports: {} };
  const evaluate = new Function('exports', 'module', 'require', output.outputText);
  evaluate(module.exports, module, require);
  return module.exports.INTENT_CATALOG;
}