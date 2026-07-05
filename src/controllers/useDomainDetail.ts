import { useMemo } from 'react';
import { DomainService } from '../services/DomainService';
import type { Domain } from '../models';

export interface DomainDetailViewModel {
  domain:     Domain | undefined;
  isNotFound: boolean;
  openIssueCount:       number;
  notImplControlCount:  number;
}

export function useDomainDetail(domainId: string): DomainDetailViewModel {
  const domain = useMemo(() => DomainService.getById(domainId), [domainId]);

  const openIssueCount = useMemo(
    () => domain ? DomainService.getOpenIssueCount(domain) : 0,
    [domain],
  );

  const notImplControlCount = useMemo(
    () => domain ? DomainService.getNotImplementedControlCount(domain) : 0,
    [domain],
  );

  return {
    domain,
    isNotFound: !domain,
    openIssueCount,
    notImplControlCount,
  };
}
