import type { Broker } from '../broker/types.ts';
import type { JobData } from './types.ts';
import { JobStatus } from './types.ts';
import { BaseEventEmitter } from '../lib/event-emitter.ts';

/**
 * Event emitted when job state changes.
 */
export type JobEvent = {
  job: JobData;
  previousStatus?: JobStatus;
};

/**
 * Event map for Job.
 */
export type JobEventMap = {
  stateChange: JobEvent;
  completed: JobEvent;
  failed: JobEvent;
};

/**
 * Job provides methods to interact with and track a job.
 */
export class Job<TInput = unknown, TOutput = unknown> extends BaseEventEmitter<JobEventMap> {
  private broker: Broker;
  private jobId: string;
  private waitingPromises = new Set<{
    resolve: (job: JobData<TInput, TOutput>) => void;
    reject: (error: Error) => void;
  }>();
  private unsubscribe?: () => void;

  constructor(broker: Broker, jobId: string) {
    super();
    this.broker = broker;
    this.jobId = jobId;
    this.setupEventListener();
  }

  /**
   * Get the job ID.
   * @returns The job ID.
   */
  get id(): string {
    return this.jobId;
  }

  /**
   * Get the current job state.
   * @returns The current job state or undefined if not found.
   */
  async getJobData(): Promise<JobData<TInput, TOutput> | undefined> {
    return this.broker.getJob(this.jobId) as Promise<JobData<TInput, TOutput> | undefined>;
  }

  /**
   * Wait for the job to complete and return the result.
   * @returns The job result.
   */
  async wait(): Promise<TOutput> {
    const job = await this.waitForCompletion();

    if (job.status === JobStatus.FAILED) {
      const error = job.error instanceof Error ? job.error : new Error(String(job.error));
      throw error;
    }

    if (!job.result) {
      throw new Error('Job completed but no result available');
    }

    return job.result;
  }

  /**
   * Wait for the job to reach a terminal state (completed or failed).
   * @returns The completed job.
   */
  async waitForCompletion(): Promise<JobData<TInput, TOutput>> {
    const currentJob = await this.getJobData();

    if (!currentJob) {
      throw new Error(`Job ${this.jobId} not found`);
    }

    // If already in terminal state, return immediately
    if (currentJob.status === JobStatus.COMPLETED || currentJob.status === JobStatus.FAILED) {
      return currentJob;
    }

    // Wait for completion
    return new Promise((resolve, reject) => {
      this.waitingPromises.add({ resolve, reject });
    });
  }

  /**
   * Clean up resources.
   */
  destroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = undefined;
    }
    this.removeAllListeners();
    this.waitingPromises.clear();
  }

  /**
   * Setup event listener for job state changes.
   */
  private setupEventListener(): void {
    // Subscribe to job state changes
    this.unsubscribe = this.broker.subscribe(this.jobId, (event) => {
      const job = event.job as JobData<TInput, TOutput>;
      const jobEvent: JobEvent = {
        job,
        previousStatus: event.previousStatus,
      };

      // Emit state change event
      super.emit('stateChange', jobEvent);

      // Emit specific events and resolve promises
      if (job.status === JobStatus.COMPLETED) {
        super.emit('completed', jobEvent);

        // Resolve waiting promises
        for (const promise of this.waitingPromises) {
          promise.resolve(job);
        }
        this.waitingPromises.clear();
      }

      if (job.status === JobStatus.FAILED) {
        super.emit('failed', jobEvent);

        // Resolve waiting promises
        for (const promise of this.waitingPromises) {
          promise.resolve(job);
        }
        this.waitingPromises.clear();
      }
    });

    // Check initial state in case job is already completed
    void this.checkInitialState();
  }

  /**
   * Check initial job state and emit events if already completed.
   */
  private async checkInitialState(): Promise<void> {
    try {
      const job = await this.getJobData();

      if (!job) {
        const error = new Error(`Job ${this.jobId} not found`);
        for (const promise of this.waitingPromises) {
          promise.reject(error);
        }
        this.waitingPromises.clear();
        return;
      }

      // If already in terminal state, emit events and resolve promises
      if (job.status === JobStatus.COMPLETED || job.status === JobStatus.FAILED) {
        const event: JobEvent = { job };

        super.emit('stateChange', event);

        if (job.status === JobStatus.COMPLETED) {
          super.emit('completed', event);
        } else {
          super.emit('failed', event);
        }

        // Resolve waiting promises
        for (const promise of this.waitingPromises) {
          promise.resolve(job);
        }
        this.waitingPromises.clear();
      }
    } catch (error) {
      // Handle error
      for (const promise of this.waitingPromises) {
        promise.reject(error instanceof Error ? error : new Error(String(error)));
      }
      this.waitingPromises.clear();
    }
  }
}

/**
 * Create a new job with unique ID.
 * @param taskPath Task path.
 * @param data Input data.
 * @returns New job instance.
 */
export const createJob = <TInput = unknown, TOutput = unknown>(
  taskPath: string,
  data: TInput,
): JobData<TInput, TOutput> => {
  return {
    id: generateJobId(),
    status: JobStatus.PENDING,
    data,
    taskPath,
    createdAt: new Date(),
  };
};

/**
 * Generate unique job ID.
 * @internal
 * @returns Unique job identifier.
 */
const generateJobId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 9);
  return `job_${timestamp}_${random}`;
};
