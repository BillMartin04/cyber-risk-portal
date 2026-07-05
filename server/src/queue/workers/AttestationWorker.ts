import type { IWorker, QueueJob } from '../types';

interface AttestationPayload {
  domainId:    string;
  domainName:  string;
  attester:    string;
  dueDate:     string;
  riskCount:   number;
  controlCount: number;
}

class AttestationWorkerImpl implements IWorker {
  readonly jobType = 'ATTESTATION_REMINDER';

  async process(job: QueueJob): Promise<unknown> {
    const payload = job.payload as AttestationPayload;
    // In production: send email/Teams notification to attester
    console.log(`[AttestationWorker] Sending reminder to ${payload.attester} for ${payload.domainName} — due ${payload.dueDate}`);
    return {
      sent:      true,
      recipient: payload.attester,
      domain:    payload.domainName,
      dueDate:   payload.dueDate,
    };
  }
}

export const AttestationWorker: IWorker = new AttestationWorkerImpl();
