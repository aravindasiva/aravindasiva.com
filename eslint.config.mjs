import coreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier'
import tseslint from 'typescript-eslint'

/*
  The data side resolves a typed line to plain data and must stay serialisable,
  because each route resolves its command on the server and hands the result to
  the client shell as a prop. A component, a framework or a stylesheet in there
  would make that impossible, so it is blocked rather than left to discipline.

  The globs cover .tsx as well as .ts on purpose. They did not, and a .tsx file
  under src/commands importing react linted clean.

  tests/boundary.test.ts proves the rule actually fires.
*/
const DATA_SIDE = [
  'src/commands/**/*.{ts,tsx}',
  'src/interpreter/**/*.{ts,tsx}',
  'src/content/**/*.{ts,tsx}',
  'src/lib/**/*.{ts,tsx}',
]

const boundaryMessage =
  'The data side returns plain data. Anything that renders belongs in src/outputs, src/terminal or src/components.'

const dataSideBoundary = {
  paths: [
    { name: 'react', message: boundaryMessage },
    { name: 'react-dom', message: boundaryMessage },
    { name: 'next', message: boundaryMessage },
  ],
  patterns: [
    { group: ['react/*', 'react-dom/*', 'next/*'], message: boundaryMessage },
    {
      group: [
        '@/components/*',
        '@/outputs/*',
        '@/terminal/*',
        '@/desktop/*',
        '@/hooks/*',
      ],
      message: boundaryMessage,
    },
    { group: ['*.css', '**/*.css'], message: boundaryMessage },
  ],
}

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/.vercel/**',
      '**/coverage/**',
      '**/dist/**',
      '**/*.cjs',
    ],
  },

  ...coreWebVitals,
  ...nextTypescript,
  ...tseslint.configs.strict,
  prettier,

  {
    languageOptions: {
      parserOptions: { tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports' },
      ],
    },
  },

  {
    files: DATA_SIDE,
    rules: {
      '@typescript-eslint/no-restricted-imports': ['error', dataSideBoundary],
    },
  },
)
