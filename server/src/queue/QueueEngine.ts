import { v4 as uuidv4 } from 'uuid';
import type { QueueJob, IWorker, JobStatus, JobPriority, EnqueueOptions } from './types';
import { AttestationWorker }       from './workers/AttestationWorker';
import { EscalationWorker }        from './workers/EscalationWorker';
import { EvidenceCollectionWorker } from './workers/EvidenceCollectionWorker';

const PRIORITY_ORDER: Record<JobPriority, number> = {
  critical: 0, high: 1, normal: 2, low: 3,
};

export interface IQueueEngine {
  enqueue(type: string, payload: unknown, options?: EnqueueOptions): QueueJob;
  getJob(id: string): QueueJob | undefined;
  listJobs(status?: JobStatus): QueueJob[];
  processNext(): Promise<QueueJob | null>;
  processAll(): Promise<void>;
  registerWorker(worker: IWorker): void;
}

class QueueEngineImpl implements IQueueEngine {
  private readonly jobs    = new Map<string, QueueJob>();
  private readonly workers = new Map<string, IWorker>();
  private processing = false;

  constructor(workers: IWorker[]) {
    workers.forEach(w => this.workers.set(w.jobType, w));
  }

  registerWorker(worker: IWorker): void {
    this.workers.set(worker.jobType, worker);
  }

  enqueue(type: string, payload: unknown, options: EnqueueOptions = {}): QueueJob {
    const job: QueueJob = {
      id:          uuidv4(),
      type,
      payload,
      priority:    options.priority    ?? 'normal',
      status:      options.scheduledAt ? 'scheduled' : 'pending',
      retries:     0,
      maxRetries:  options.maxRetries  ?? 3,
      createdAt:   new Date().toISOString(),
      scheduledAt: options.scheduledAt,
    };
    this.jobs.set(job.id, job);
    // auto-process in background after enqueue
    setImmediate(() => this.processAll());
    return job;
  }

  getJob(id: string): QueueJob | undefined {
    return this.jobs.get(id);
  }

  listJobs(status?: JobStatus): QueueJob[] {
    const all = Array.from(this.jobs.values())
      .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
    return status ? all.filter(j => j.status === status) : all;
  }

  async processNext(): Promise<QueueJob | null> {
    const pending = this.listJobs('pending');
    if (pending.length === 0) return null;

    const job = pending[0];
    const worker = this.workers.get(job.type);
    if (!worker) {
      this.updateJob(job.id, { status: 'failed', error: `No worker registered for job type '${job.type}'` });
      return null;
    }

    this.updateJob(job.id, { status: 'processing', startedAt: new Date().toISOString() });
    try {
      const result = await worker.process(job);
      this.updateJob(job.id, { status: 'completed', completedAt: new Date().toISOString(), result });
      return this.jobs.get(job.id)!;
    } catch (err) {
      const error   = err instanceof Error ? err.message : String(err);
      const retries = job.retries + 1;
      if (retries < job.maxRetries) {
        this.updateJob(job.id, { status: 'pending', retries, error });
      } else {
        this.updateJob(job.id, { status: 'failed', retries, error, completedAt: new Date().toISOString() });
      }
      return null;
    }
  }

  async processAll(): Promise<void> {
    if (this.processing) return;
    this.processing = true;
    try {
      while (this.listJobs('pending').length > 0) {
        await this.processNext();
      }
    } finally {
      this.processing = false;
    }
  }

  private updateJob(id: string, updates: Partial<QueueJob>): void {
    const job = this.jobs.get(id);
    if (job) this.jobs.set(id, { ...job, ...updates });
  }
}

export const QueueEngine: IQueueEngine = new QueueEngineImpl([
  AttestationWorker,
  EscalationWorker,
  EvidenceCollectionWorker,
]);
