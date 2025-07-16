import type { Broker, JobStateChangeListener, JobStateChangeEvent } from './types.ts';
import type { JobData } from '../job/types.ts';

/**
 * In-memory broker implementation for development and testing.
 */
export class InMemoryBroker implements Broker {
  private lanes = new Map<string, JobData[]>();
  private jobs = new Map<string, JobData>();
  private listeners = new Map<string, Set<JobStateChangeListener>>();

  constructor() {
    // No options currently used
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async enqueue<TInput = unknown, TOutput = unknown>(lane: string, job: JobData<TInput, TOutput>): Promise<void> {
    // Store job in jobs map
    this.jobs.set(job.id, job);

    // Add to lane queue
    if (!this.lanes.has(lane)) {
      this.lanes.set(lane, []);
    }
    this.lanes.get(lane)!.push(job);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async dequeue(lane: string): Promise<JobData | undefined> {
    const queue = this.lanes.get(lane);
    if (!queue || queue.length === 0) {
      return undefined;
    }

    const job = queue.shift()!;
    return job;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async updateJob(jobId: string, updates: Partial<JobData>): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job) {
      throw new Error(`Job ${jobId} not found`);
    }

    const previousStatus = job.status;

    // Update job properties
    Object.assign(job, updates);

    // Emit state change event if status changed
    if (updates.status && updates.status !== previousStatus) {
      this.emitJobStateChange(jobId, job, previousStatus);
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getJob(jobId: string): Promise<JobData | undefined> {
    return this.jobs.get(jobId);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async close(): Promise<void> {
    this.lanes.clear();
    this.jobs.clear();
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async size(lane: string): Promise<number> {
    return this.lanes.get(lane)?.length ?? 0;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async clear(lane: string): Promise<void> {
    const queue = this.lanes.get(lane);
    if (queue) {
      // Remove jobs from jobs map and clean up listeners
      for (const job of queue) {
        this.jobs.delete(job.id);
        this.listeners.delete(job.id);
      }
      // Clear lane
      this.lanes.delete(lane);
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async isHealthy(): Promise<boolean> {
    // InMemoryBroker is always healthy as long as it exists
    return true;
  }

  subscribe(jobId: string, listener: JobStateChangeListener): () => void {
    if (!this.listeners.has(jobId)) {
      this.listeners.set(jobId, new Set());
    }
    this.listeners.get(jobId)!.add(listener);

    /**
     * Return unsubscribe function.
     */
    return () => {
      this.unsubscribe(jobId, listener);
    };
  }

  unsubscribe(jobId: string, listener: JobStateChangeListener): void {
    const listeners = this.listeners.get(jobId);
    if (listeners) {
      listeners.delete(listener);
      if (listeners.size === 0) {
        this.listeners.delete(jobId);
      }
    }
  }

  /**
   * Emit job state change event to all listeners.
   * @param jobId Job ID.
   * @param job Job object.
   * @param previousStatus Previous job status.
   */
  private emitJobStateChange(jobId: string, job: JobData, previousStatus?: string): void {
    const listeners = this.listeners.get(jobId);
    if (listeners) {
      const event: JobStateChangeEvent = {
        jobId,
        job,
        previousStatus: previousStatus as JobStateChangeEvent['previousStatus'],
      };

      for (const listener of listeners) {
        try {
          listener(event);
        } catch {
          // Ignore listener errors
        }
      }
    }
  }
}

/**
 * Factory function to create InMemoryBroker instance.
 * @returns New InMemoryBroker instance.
 */
export const createInMemoryBroker = (): InMemoryBroker => {
  return new InMemoryBroker();
};
