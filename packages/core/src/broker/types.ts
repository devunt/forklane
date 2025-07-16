import type { JobData, JobStatus } from '../job/types.ts';

/**
 * Event emitted when job state changes.
 */
export type JobStateChangeEvent = {
  jobId: string;
  job: JobData;
  previousStatus?: JobStatus;
};

/**
 * Listener function for job state changes.
 */
export type JobStateChangeListener = (event: JobStateChangeEvent) => void;

/**
 * Broker interface
 * Handles storage, management, and distributed processing of task queues.
 */
export type Broker = {
  /**
   * Add a job to a lane (queue).
   * @param lane Lane name.
   * @param job Job object.
   */
  enqueue<TInput = unknown, TOutput = unknown>(lane: string, job: JobData<TInput, TOutput>): Promise<void>;

  /**
   * Get the next job from a lane.
   * @internal
   * @param lane Lane name.
   * @returns Job object or undefined (when queue is empty).
   */
  dequeue(lane: string): Promise<JobData | undefined>;

  /**
   * Update job status.
   * @internal
   * @param jobId Job ID.
   * @param updates Fields to update.
   */
  updateJob(jobId: string, updates: Partial<JobData>): Promise<void>;

  /**
   * Get a job by ID.
   * @internal
   * @param jobId Job ID.
   * @returns Job object or undefined.
   */
  getJob(jobId: string): Promise<JobData | undefined>;

  /**
   * Close broker connection.
   * @internal
   */
  close(): Promise<void>;

  /**
   * Get the number of pending jobs in a lane.
   * @internal
   * @param lane Lane name.
   * @returns Number of pending jobs.
   */
  size?(lane: string): Promise<number>;

  /**
   * Clear all jobs from a lane.
   * @internal
   * @param lane Lane name.
   */
  clear?(lane: string): Promise<void>;

  /**
   * Check broker health status.
   * @internal
   * @returns True if broker is working properly.
   */
  isHealthy?(): Promise<boolean>;

  /**
   * Subscribe to job state changes.
   * @internal
   * @param jobId Job ID to watch.
   * @param listener Callback function for state changes.
   * @returns Unsubscribe function.
   */
  subscribe(jobId: string, listener: JobStateChangeListener): () => void;

  /**
   * Unsubscribe from job state changes.
   * @internal
   * @param jobId Job ID to stop watching.
   * @param listener Listener to remove.
   */
  unsubscribe(jobId: string, listener: JobStateChangeListener): void;
};

/**
 * Type for broker factory function.
 */
export type BrokerFactory<T extends Broker = Broker, O = unknown> = (options?: O) => T;
