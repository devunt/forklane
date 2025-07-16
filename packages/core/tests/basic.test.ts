import { describe, it, expect } from 'vitest';
import { version } from '../src/index.ts';

describe('@forklane/core', () => {
  it('should export version', () => {
    expect(version).toBe('0.0.0');
  });
});
