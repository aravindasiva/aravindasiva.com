import coreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier'
import tseslint from 'typescript-eslint'

/*
  The data side (src/commands, src/content) resolves a command name to plain
  data and must stay renderable by anything. Importing a component, a framework
  or a stylesheet there collapses that separation, so it is blocked rather than
  left to discipline. tests/boundary.test.ts proves the rule actually fires.
*/
const DATA_SIDE = ['src/commands/**/*.ts', 'src/content/**/*.ts']

const boundaryMessage =
  'The data side returns plain data. Move anything that renders into src/components or src/features.'

const dataSideBoundary = {
  paths: [
    { name: 'react', message: boundaryMessage },
    { name: 'react-dom', message: boundaryMessage },
    { name: 'next', message: boundaryMessage },
  ],
  patterns: [
    { group: ['react/*', 'react-dom/*', 'next/*'], message: boundaryMessage },
    {
      group: ['@/components/*', '@/features/*', '@/hooks/*'],
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
