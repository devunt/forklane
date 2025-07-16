/**
 * Forklane - API router-style distributed task queue.
 *
 * Re-exports all exports from @forklane/core.
 */

export * from '@forklane/core';

import { createInMemoryBroker } from '@forklane/core';

const broker = createInMemoryBroker();
void broker.enqueue('', '' as never);
