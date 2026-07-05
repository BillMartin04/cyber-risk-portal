import type { IWorker, QueueJob } from '../types';

interface EvidenceCollectionPayload {
  riskId:    string;
  riskName:  string;
  requestedBy: string;
  artifactTypes: string[];
}

class EvidenceCollectionWorkerImpl implements IWorker {
  readonly jobType = 'EVIDENCE_COLLECTION';

  async process(job: QueueJob): Promise<unknown> {
    const payload = job.payload as EvidenceCollectionPayload;
    console.log(`[EvidenceWorker] Collecting evidence for '${payload.riskName}' — types: ${payload.artifactTypes.join(', ')}`);
    return {
      collected:    true,
      riskId:       payload.riskId,
      artifactTypes: payload.artifactTypes,
      collectedAt:  new Date().toISOString(),
    };
  }
}

export const EvidenceCollectionWorker: IWorker = new EvidenceCollectionWorkerImpl();
