import { readFile, writeFile } from 'node:fs/promises';
import { build } from 'esbuild';
import { DEFAULT_CONFIG } from '../src/config.js';

const outfile = 'dist/bangumi-tagpilot.user.js';
const banner = `// ==UserScript==
// @name         Bangumi TagPilot
// @name:zh-CN   Bangumi 智能标签助手
// @namespace    https://github.com/bangumi-tagpilot
// @version      ${DEFAULT_CONFIG.version}
// @description  Safe local rule-based tag suggestion assistant for Bangumi collection tagging.
// @match        https://bgm.tv/subject/*
// @match        https://bangumi.tv/subject/*
// @match        https://chii.in/subject/*
// @grant        none
// ==/UserScript==
`;

await build({
  entryPoints: ['src/main.js'],
  outfile,
  bundle: true,
  format: 'iife',
  platform: 'browser',
  target: ['es2020'],
  minify: false,
  sourcemap: false,
  banner: {
    js: banner,
  },
});

const output = await readFile(outfile, 'utf8');
await writeFile(outfile, output.replace(/\r\n/g, '\n'), 'utf8');
