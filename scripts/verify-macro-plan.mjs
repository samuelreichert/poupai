import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

import ts from 'typescript';

const source = fs.readFileSync(new URL('../lib/macro-plan.ts', import.meta.url), 'utf8');
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
      throw new Error(`Unexpected runtime import in macro-plan test: ${specifier}`);
    },
  },
  { filename: 'lib/macro-plan.ts' },
);

const { getMacroAllocationRows, getNearestOpenGoal } = module.exports;

const openGoals = [{ targetValue: 500 }, { targetValue: 2500 }, { targetValue: 1200 }];

assert.deepEqual(getNearestOpenGoal(1000, openGoals), { targetValue: 1200 });
assert.deepEqual(getNearestOpenGoal(1200, openGoals), { targetValue: 1200 });
assert.deepEqual(getNearestOpenGoal(3000, openGoals), { targetValue: 2500 });
assert.equal(getNearestOpenGoal(0, []), null);

const rows = getMacroAllocationRows(1200, [
  { name: 'Ações', kind: 'stocks', idealPercent: 0.6, currentValue: 500, displayOrder: 1 },
  { name: 'Renda Fixa', kind: 'renda_fixa', idealPercent: 0.4, currentValue: 300, displayOrder: 2 },
]);

assert.equal(rows[0].idealValue, 720);
assert.equal(rows[0].currentPercent, 0.625);
assert.equal(rows[0].diffToIdeal, 220);
assert.equal(rows[1].idealValue, 480);
assert.equal(rows[1].currentPercent, 0.375);
assert.equal(rows[1].diffToIdeal, 180);

console.log('macro-plan checks passed');
