# aravindasiva.com

A portfolio that behaves like a terminal.

It opens with `whoami` and `ls` already run, pinned at the top. You can type
commands, click them in the title bar, or click things inside the output. There
are a few files that start with a dot, and a desktop behind the window.

Live at [aravindasiva.com](https://aravindasiva.com).

## How it works

Each unique command appears on screen at most once. Run something already showing
and the old block is replaced rather than duplicated, so typing `whoami` and
`experience` back and forth ten times never builds an infinite page. What stays
on screen always reads as a portfolio rather than a transcript.

The whole interaction model is one sentence:

> The visible scrollback equals the executions since the last `clear`, filtered to
> the last occurrence of each identity key, in that order.

That is a pure function, so it is tested without rendering anything.

Every public command is also a real route. `/experience` is a prerendered HTML
page, not a client render, because the bots that generate link previews on
LinkedIn, Slack and everywhere else do not run JavaScript. After first paint the
shell takes over and nothing else touches the network.

## Stack

Next.js 16 with the App Router, fully prerendered. TypeScript, Tailwind v4, zod
for content validation, Vitest for the pure logic. pnpm, Node 24, deployed on
Vercel. No CMS, no database, no API.

## Layout

```
content/            JSON, hand edited, zod validated
src/
  app/              routes, thin
  commands/         resolves a command name to data. never renders
  content/          schemas and derived values
  components/       ui/ is vendored shadcn, the rest is mine
  features/         Terminal, Desktop
  hooks/  lib/  styles/
tests/              mirrors the source path
```

`src/commands` and `src/content` may not import React, Next, a component or a
stylesheet. That is the one architectural rule and it is enforced by ESLint, with
a test that proves the rule actually fires.

## Running it

```bash
nvm use          # Node 24
pnpm install
pnpm dev
```

`pnpm test` runs the logic tests, `pnpm lint` and `pnpm typecheck` do what you
would expect, and CI runs all of it plus a build on every pull request.

## Licence

Code is MIT, take what is useful. The words, photos and CV under `content/`,
`public/media/` and `public/cv/` are mine and are not licensed for reuse.

Take the code. Write your own words.
