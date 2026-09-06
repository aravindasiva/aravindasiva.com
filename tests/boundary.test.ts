import { readdirSync } from 'node:fs'
import { join } from 'node:path'

import { ESLint } from 'eslint'
import { describe, expect, it } from 'vitest'

/*
  The data side boundary is this project's one enforced architectural rule, so it
  is verified rather than trusted. Each case lints real source text through the
  real config at a real data-side path, proving the rule both fires and does not
  misfire. A config change that quietly drops the rule fails here.
*/

const RULE = '@typescript-eslint/no-restricted-imports'

const DATA_SIDE_DIRS = ['src/commands', 'src/interpreter', 'src/lib']

const eslint = new ESLint()

async function ruleIdsFor(filePath: string, code: string) {
  const [result] = await eslint.lintText(code, { filePath })

  return (result?.messages ?? []).map((message) => message.ruleId)
}

function filesUnder(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true, recursive: true })
    .filter((entry) => entry.isFile())
    .map((entry) => join(entry.parentPath, entry.name))
}

describe('data side boundary', () => {
  it('rejects a framework import', async () => {
    const ruleIds = await ruleIdsFor(
      'src/commands/boundary-fixture.ts',
      "import { useState } from 'react'\nexport const value = useState\n",
    )

    expect(ruleIds).toContain(RULE)
  })

  it('rejects a surface import', async () => {
    const ruleIds = await ruleIdsFor(
      'src/commands/boundary-fixture.ts',
      "import { Prompt } from '@/terminal/components/Prompt'\nexport const value = Prompt\n",
    )

    expect(ruleIds).toContain(RULE)
  })

  it('rejects a renderer import', async () => {
    const ruleIds = await ruleIdsFor(
      'src/commands/boundary-fixture.ts',
      "import { CommandOutput } from '@/outputs/CommandOutput'\nexport const value = CommandOutput\n",
    )

    expect(ruleIds).toContain(RULE)
  })

  it('rejects a type-only framework import', async () => {
    const ruleIds = await ruleIdsFor(
      'src/commands/boundary-fixture.ts',
      "import type { ReactNode } from 'react'\nexport type Value = ReactNode\n",
    )

    expect(ruleIds).toContain(RULE)
  })

  it('guards the interpreter too', async () => {
    const ruleIds = await ruleIdsFor(
      'src/interpreter/boundary-fixture.ts',
      "import { useState } from 'react'\nexport const value = useState\n",
    )

    expect(ruleIds).toContain(RULE)
  })

  it('guards a .tsx file, not only .ts', async () => {
    const ruleIds = await ruleIdsFor(
      'src/commands/boundary-fixture.tsx',
      "import { useState } from 'react'\nexport const value = useState\n",
    )

    expect(ruleIds).toContain(RULE)
  })

  it('allows plain data', async () => {
    const ruleIds = await ruleIdsFor(
      'src/commands/boundary-fixture.ts',
      "export const value = { kind: 'help', entries: [] }\n",
    )

    expect(ruleIds).not.toContain(RULE)
  })

  /*
    Belt and braces behind the glob. If a .tsx ever lands on the data side, this
    says so in one line rather than leaving it to whether someone happened to
    import react in it.
  */
  it('has no .tsx anywhere on the data side', () => {
    const offenders = DATA_SIDE_DIRS.flatMap(filesUnder).filter((file) =>
      file.endsWith('.tsx'),
    )

    expect(offenders).toEqual([])
  })
})
