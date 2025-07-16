import type { TasksFunction } from './types.ts';
import { createTaskBuilderFactory } from './builder.ts';

/**
 * Create task definitions using a builder pattern.
 * @param fn Task builder function.
 * @returns Task definitions.
 * @example
 * ```ts
 * const myTasks = tasks((t) => ({
 *   // Simple task without input
 *   hello: t.handler(async () => {
 *     return { message: "Hello, World!" };
 *   }),
 *
 *   // Task with input validation
 *   greet: t
 *     .input(z.object({ name: z.string() }))
 *     .handler(async ({ name }) => {
 *       return { message: `Hello, ${name}!` };
 *     }),
 *
 *   // Task with input and output validation
 *   calculate: t
 *     .input(z.object({ a: z.number(), b: z.number() }))
 *     .output(z.object({ result: z.number() }))
 *     .handler(async ({ a, b }) => {
 *       return { result: a + b };
 *     }),
 *
 *   // Nested tasks
 *   users: {
 *     create: t
 *       .input(z.object({ email: z.string().email() }))
 *       .handler(async ({ email }) => {
 *         // Create user logic
 *         return { id: "123", email };
 *       }),
 *   },
 * }));
 * ```
 */
export const tasks = <T>(fn: TasksFunction<T>): T => {
  const factory = createTaskBuilderFactory();
  return fn(factory);
};
