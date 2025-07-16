import type { ZodSchema } from 'zod';
import type { TaskBuilder, TaskDefinition, TaskConfig, TaskBuilderFactory, MaybePromise } from './types.ts';

/**
 * Internal task builder implementation.
 */
class TaskBuilderImpl<TInput = unknown, TOutput = unknown> implements TaskBuilder<TInput, TOutput> {
  private _input?: ZodSchema<TInput>;
  private _output?: ZodSchema<TOutput>;
  private _config?: TaskConfig;

  input<T>(schema: ZodSchema<T>): TaskBuilder<T, TOutput> {
    const newBuilder = new TaskBuilderImpl<T, TOutput>();
    newBuilder._input = schema;
    newBuilder._output = this._output!;
    newBuilder._config = this._config;
    return newBuilder;
  }

  output<T>(schema: ZodSchema<T>): TaskBuilder<TInput, T> {
    const newBuilder = new TaskBuilderImpl<TInput, T>();
    newBuilder._input = this._input;
    newBuilder._output = schema;
    newBuilder._config = this._config;
    return newBuilder;
  }

  config(config: TaskConfig): TaskBuilder<TInput, TOutput> {
    this._config = config;
    return this;
  }

  handler(fn: (input: TInput) => MaybePromise<TOutput>): TaskDefinition<TInput, TOutput> {
    return {
      input: this._input,
      output: this._output,
      handler: fn,
      config: this._config,
    };
  }
}

/**
 * Task builder factory implementation.
 */
class TaskBuilderFactoryImpl implements TaskBuilderFactory {
  handler<TOutput>(fn: () => MaybePromise<TOutput>): TaskDefinition<void, TOutput> {
    return {
      handler: fn as (input: void) => MaybePromise<TOutput>,
    };
  }

  input<TInput>(schema: ZodSchema<TInput>): TaskBuilder<TInput, unknown> {
    const builder = new TaskBuilderImpl<TInput, unknown>();
    return builder.input(schema);
  }
}

/**
 * Create a task builder factory instance.
 * @internal
 * @returns New TaskBuilderFactory instance.
 */
export const createTaskBuilderFactory = (): TaskBuilderFactory => {
  return new TaskBuilderFactoryImpl();
};
