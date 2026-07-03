import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

import ts from 'typescript';

const source = fs.readFileSync(new URL('../lib/onboarding-plan.ts', import.meta.url), 'utf8');
const module = { exports: {} };
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
  },
});

vm.runInNewContext(
  outputText,
  {
    exports: module.exports,
    module,
    require(specifier) {
      throw new Error(`Unexpected runtime import in onboarding-plan test: ${specifier}`);
    },
  },
  { filename: 'lib/onboarding-plan.ts' },
);

const {
  createOnboardingMacroDraft,
  getOnboardingSaveMacros,
  getSelectedOnboardingMacros,
  hasSelectedOnboardingMacros,
  toggleOnboardingMacroSelection,
  updateOnboardingMacroDraft,
} = module.exports;

const starterMacros = [
  { name: 'Ações', kind: 'stocks', idealPercent: 0, currentValue: 0, displayOrder: 1 },
  { name: 'Renda Fixa', kind: 'renda_fixa', idealPercent: 0, currentValue: 0, displayOrder: 2 },
  { name: 'Cripto', kind: 'cripto', idealPercent: 0, currentValue: 0, displayOrder: 3 },
];

let draft = createOnboardingMacroDraft(starterMacros);
assert.equal(hasSelectedOnboardingMacros(draft), false);

draft = toggleOnboardingMacroSelection(draft, 'renda_fixa');
draft = updateOnboardingMacroDraft(draft, 'renda_fixa', {
  idealPercent: 1,
  currentValue: 500,
});

assert.equal(hasSelectedOnboardingMacros(draft), true);
assert.deepEqual(
  getSelectedOnboardingMacros(draft).map((macro) => macro.kind),
  ['renda_fixa'],
);
assert.equal(
  JSON.stringify(getOnboardingSaveMacros(draft)),
  JSON.stringify([
    {
      name: 'Renda Fixa',
      kind: 'renda_fixa',
      idealPercent: 1,
      currentValue: 500,
      displayOrder: 1,
    },
  ]),
);

console.log('onboarding-plan checks passed');
