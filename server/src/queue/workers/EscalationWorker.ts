import type { IWorker, QueueJob } from '../types';

interface EscalationPayload {
  riskId:      string;
  riskName:    string;
  escalateTo:  string;
  reason:      string;
  severity:    string;
  initiatedBy: string;
}

class EscalationWorkerImpl implements IWorker {
  readonly jobType = 'RISK_ESCALATION';

  async process(job: QueueJob): Promise<unknown> {
    const payload = job.payload as EscalationPayload;
    console.log(`[EscalationWorker] Escalating '${payload.riskName}' to ${payload.escalateTo} — ${payload.reason}`);
    return {
      escalated:  true,
      riskId:     payload.riskId,
      escalatedTo: payload.escalateTo,
      timestamp:  new Date().toISOString(),
    };
  }
}

export const EscalationWorker: IWorker = new EscalationWorkerImpl();
