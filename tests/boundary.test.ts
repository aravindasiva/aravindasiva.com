import { ESLint } from 'eslint'
import { describe, expect, it } from 'vitest'

/*
  The data side boundary is this project's one enforced architectural rule, so it
  is verified rather than trusted. Each case lints real source text through the
  real config at a path inside src/commands, proving the rule both fires and does
  not misfire. A config change that quietly drops the rule fails here.
*/

const RULE = '@typescript-eslint/no-restricted-imports'

const eslint = new ESLint()

async function ruleIdsFor(code: string) {
  const [result] = await eslint.lintText(code, {
    filePath: 'src/commands/boundary-fixture.ts',
  })

  return (result?.messages ?? []).map((message) => message.ruleId)
}

describe('data side boundary', () => {
  it('rejects a framework import', async () => {
    const ruleIds = await ruleIdsFor(
      "import { useState } from 'react'\nexport const value = useState\n",
    )

    expect(ruleIds).toContain(RULE)
  })

  it('rejects a component import', async () => {
    const ruleIds = await ruleIdsFor(
      "import { Prompt } from '@/components/Prompt/Prompt'\nexport const value = Prompt\n",
    )

    expect(ruleIds).toContain(RULE)
  })

  it('rejects a type-only framework import', async () => {
    const ruleIds = await ruleIdsFor(
      "import type { ReactNode } from 'react'\nexport type Value = ReactNode\n",
    )

    expect(ruleIds).toContain(RULE)
  })

  it('allows plain data', async () => {
    const ruleIds = await ruleIdsFor(
      "export const value = { kind: 'text', payload: 'hello' }\n",
    )

    expect(ruleIds).not.toContain(RULE)
  })
})
