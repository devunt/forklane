/**
 * Core implementation of Forklane.
 * API router-style distributed task queue.
 */

export const version = '0.0.0';

// Task type exports
export type {
  TaskConfig,
  TaskDefinition,
  TaskBuilder,
  TasksFunction,
  TaskBuilderFactory,
  TaskTree,
} from './task/types.ts';

// Job type exports
export type { JobData } from './job/types.ts';
export { JobStatus } from './job/types.ts';

// Worker type exports
export type { WorkerConfig } from './worker/types.ts';

// Client type exports
export type { ClientConfig } from './client/types.ts';

// Broker type exports
export type { Broker, BrokerFactory } from './broker/types.ts';

// Task functions
export { tasks } from './task/tasks.ts';
export type { MaybePromise } from './task/types.ts';

// Job functions and classes
export { Job, createJob } from './job/job.ts';
export type { JobEvent, JobEventMap } from './job/job.ts';

// Broker implementations
export { InMemoryBroker, createInMemoryBroker } from './broker/memory.ts';

// Library utilities
export { BaseEventEmitter } from './lib/event-emitter.ts';
export type { EventEmitter, EventListener } from './lib/event-emitter.ts';

// TODO: Functions to be implemented in Phase 3
// export { serve } from './serve.ts';
// export { connect } from './connect.ts';
