import type { ZodSchema } from 'zod';

/**
 * Utility type for values that can be either synchronous or asynchronous.
 */
export type MaybePromise<T> = T | Promise<T>;

/**
 * Task configuration.
 */
export type TaskConfig = {
  /** Task timeout in milliseconds. */
  timeout?: number;
};

/**
 * Task definition.
 */
export type TaskDefinition<TInput = unknown, TOutput = unknown> = {
  /** Input schema. */
  input?: ZodSchema<TInput>;
  /** Output schema. */
  output?: ZodSchema<TOutput>;
  /** Task handler function. */
  handler: (input: TInput) => MaybePromise<TOutput>;
  /** Task configuration. */
  config?: TaskConfig;
};

/**
 * Type for building tasks with chaining API.
 */
export type TaskBuilder<TInput = unknown, TOutput = unknown> = {
  input<T>(schema: ZodSchema<T>): TaskBuilder<T, TOutput>;
  output<T>(schema: ZodSchema<T>): TaskBuilder<TInput, T>;
  config(config: TaskConfig): TaskBuilder<TInput, TOutput>;
  handler(fn: (input: TInput) => MaybePromise<TOutput>): TaskDefinition<TInput, TOutput>;
};

/**
 * Type for tasks creation function.
 */
export type TasksFunction<T> = (builder: TaskBuilderFactory) => T;

/**
 * Task builder factory.
 */
export type TaskBuilderFactory = {
  handler<TOutput>(fn: () => MaybePromise<TOutput>): TaskDefinition<void, TOutput>;
  input<TInput>(schema: ZodSchema<TInput>): TaskBuilder<TInput, unknown>;
};

/**
 * Task tree structure.
 */
export type TaskTree = {
  [key: string]: TaskDefinition | TaskTree;
};
