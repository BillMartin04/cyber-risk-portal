export type JobStatus   = 'pending' | 'processing' | 'completed' | 'failed' | 'scheduled';
export type JobPriority = 'critical' | 'high' | 'normal' | 'low';

export interface QueueJob {
  id:          string;
  type:        string;
  payload:     unknown;
  priority:    JobPriority;
  status:      JobStatus;
  retries:     number;
  maxRetries:  number;
  createdAt:   string;
  scheduledAt?: string;
  startedAt?:  string;
  completedAt?: string;
  error?:      string;
  result?:     unknown;
}

export interface IWorker {
  readonly jobType: string;
  process(job: QueueJob): Promise<unknown>;
}

export interface EnqueueOptions {
  priority?:    JobPriority;
  scheduledAt?: string;
  maxRetries?:  number;
}
