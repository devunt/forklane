import { describe, it, expect, vi } from 'vitest';
import { InMemoryBroker } from '../src/broker/memory.ts';
import { Job, createJob } from '../src/job/job.ts';
import { JobStatus } from '../src/job/types.ts';

describe('Job with event-based system', () => {
  it('should receive state change events', async () => {
    const broker = new InMemoryBroker();
    const job = createJob('test.task', { data: 'test' });

    // Enqueue job
    await broker.enqueue('test', job);

    // Create job handle
    const handle = new Job(broker, job.id);

    // Set up event listeners
    const stateChangeHandler = vi.fn();
    const completedHandler = vi.fn();

    handle.on('stateChange', stateChangeHandler);
    handle.on('completed', completedHandler);

    // Update job to running
    await broker.updateJob(job.id, { status: JobStatus.RUNNING });

    // Wait a bit for event propagation
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(stateChangeHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        job: expect.objectContaining({ status: JobStatus.RUNNING }),
        previousStatus: JobStatus.PENDING,
      }),
    );

    // Update job to completed
    await broker.updateJob(job.id, {
      status: JobStatus.COMPLETED,
      result: { success: true },
    });

    // Wait for completion
    const result = await handle.wait();

    expect(result).toEqual({ success: true });
    expect(completedHandler).toHaveBeenCalled();

    // Clean up
    handle.destroy();
  });

  it('should handle already completed jobs', async () => {
    const broker = new InMemoryBroker();
    const job = createJob('test.task', { data: 'test' });
    job.status = JobStatus.COMPLETED;
    job.result = { done: true };

    // Enqueue already completed job
    await broker.enqueue('test', job);

    // Create job handle
    const handle = new Job(broker, job.id);

    // Should resolve immediately
    const result = await handle.wait();

    expect(result).toEqual({ done: true });

    // Clean up
    handle.destroy();
  });
});
