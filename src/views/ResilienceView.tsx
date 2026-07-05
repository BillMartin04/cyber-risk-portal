import { useResilience } from '../controllers/useResilience';
import ResilienceBanner from '../components/resilience/ResilienceBanner';
import MTTRTrendChart from '../components/resilience/MTTRTrendChart';
import BusinessServicesPanel from '../components/resilience/BusinessServicesPanel';
import DetectionCoveragePanel from '../components/resilience/DetectionCoveragePanel';
import PlaybookPanel from '../components/resilience/PlaybookPanel';

export default function ResilienceView() {
  const { trend, categoryMetrics, services, coverage, playbooks, exercises, stats } = useResilience();

  return (
    <div className="resilience-view">
      <ResilienceBanner stats={stats} />

      <div className="resilience-body">
        <div className="resilience-main">
          <MTTRTrendChart trend={trend} categoryMetrics={categoryMetrics} />
          <BusinessServicesPanel services={services} />
          <PlaybookPanel playbooks={playbooks} exercises={exercises} />
        </div>

        <div className="resilience-side">
          <DetectionCoveragePanel coverage={coverage} />
        </div>
      </div>
    </div>
  );
}
