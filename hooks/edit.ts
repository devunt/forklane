#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

try {
  const input = readFileSync(0, 'utf8');
  const hookData = JSON.parse(input) as { tool_input: { file_path: string } };

  const filePath = hookData.tool_input.file_path;
  if (!filePath) {
    process.exit(0);
  }

  if (/\.(ts|js)$/.test(filePath)) {
    try {
      await execAsync(`pnpm -w eslint --fix "${filePath}"`);
    } catch (error) {
      const execError = error as { code?: number; stderr?: string; stdout?: string };
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      console.error(execError.stderr || execError.stdout);
      process.exit(2);
    }
  }

  try {
    await execAsync(`pnpm -w prettier --write "${filePath}"`);
  } catch (error) {
    console.error(error);
  }

  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
