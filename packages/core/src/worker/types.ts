import type { TaskTree } from '../task/types.ts';

/**
 * Worker configuration.
 */
export type WorkerConfig<B = unknown> = {
  /** Task definitions. */
  tasks: TaskTree;
  /** Broker instance. */
  broker: B;
};
