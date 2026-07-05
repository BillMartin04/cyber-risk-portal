import { useState, useEffect, useCallback, useMemo } from 'react';
import type {
  Identity, IdentityStats, AccessReviewItem,
  IdentityType, IdentityStatus,
} from '../models';
import { IdentityService } from '../services/IdentityService';

export interface IdentityViewModel {
  identities:       Identity[];
  filtered:         Identity[];
  stats:            IdentityStats | null;
  accessReview:     AccessReviewItem[];
  selected:         Identity | null;
  loading:          boolean;
  error:            string | null;
  filterType:       IdentityType | 'all';
  filterStatus:     IdentityStatus | 'all';
  searchQuery:      string;
  setSelected:      (id: Identity | null) => void;
  setFilterType:    (t: IdentityType | 'all') => void;
  setFilterStatus:  (s: IdentityStatus | 'all') => void;
  setSearchQuery:   (q: string) => void;
  refresh:          () => void;
}

export function useIdentity(): IdentityViewModel {
  const [identities,   setIdentities]   = useState<Identity[]>([]);
  const [stats,        setStats]        = useState<IdentityStats | null>(null);
  const [accessReview, setAccessReview] = useState<AccessReviewItem[]>([]);
  const [selected,     setSelected]     = useState<Identity | null>(null);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState<string | null>(null);
  const [filterType,   setFilterType]   = useState<IdentityType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<IdentityStatus | 'all'>('all');
  const [searchQuery,  setSearchQuery]  = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [ids, st, ar] = await Promise.all([
        IdentityService.getAllIdentities(),
        IdentityService.getStats(),
        IdentityService.getAccessReviewQueue(),
      ]);
      setIdentities(ids);
      setStats(st);
      setAccessReview(ar);
    } catch (e) {
      setError('Failed to load identity data. Ensure the server is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    let result = identities;
    if (filterType !== 'all')   result = result.filter(i => i.type === filterType);
    if (filterStatus !== 'all') result = result.filter(i => i.status === filterStatus);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(i =>
        i.displayName.toLowerCase().includes(q) ||
        i.email.toLowerCase().includes(q) ||
        i.department.toLowerCase().includes(q) ||
        i.role.toLowerCase().includes(q)
      );
    }
    return result;
  }, [identities, filterType, filterStatus, searchQuery]);

  return {
    identities, filtered, stats, accessReview, selected, loading, error,
    filterType, filterStatus, searchQuery,
    setSelected, setFilterType, setFilterStatus, setSearchQuery,
    refresh: load,
  };
}
