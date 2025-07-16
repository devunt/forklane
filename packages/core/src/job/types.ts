/**
 * Job status.
 */
export const JobStatus = {
  /** Waiting to be processed. */
  PENDING: 'pending',
  /** Currently being processed. */
  RUNNING: 'running',
  /** Successfully completed. */
  COMPLETED: 'completed',
  /** Failed to complete. */
  FAILED: 'failed',
  /** Being retried. */
  RETRYING: 'retrying',
} as const;

export type JobStatus = (typeof JobStatus)[keyof typeof JobStatus];

/**
 * Job data representing a queued task.
 */
export type JobData<TInput = unknown, TOutput = unknown> = {
  /** Job ID. */
  id: string;
  /** Current status. */
  status: JobStatus;
  /** Input data. */
  data: TInput;
  /** Execution result. */
  result?: TOutput;
  /** Error information. */
  error?: Error | string;
  /** Creation time. */
  createdAt: Date;
  /** Start time. */
  startedAt?: Date;
  /** Completion time. */
  completedAt?: Date;
  /** Task path (e.g., "email.sendEmail"). */
  taskPath: string;
  /** Number of retry attempts. */
  attempts?: number;
};
