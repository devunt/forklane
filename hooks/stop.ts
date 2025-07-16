#!/usr/bin/env node

import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

try {
  try {
    await execAsync('pnpm tsc');
  } catch (error) {
    const execError = error as { code?: number; stderr?: string; stdout?: string };
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    console.error(execError.stderr || execError.stdout);
    process.exit(2);
  }

  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
