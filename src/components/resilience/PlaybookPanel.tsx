import { BookOpen, CheckCircle2, AlertCircle, Clock, XCircle } from 'lucide-react';
import type { Playbook, ScenarioExercise } from '../../models';

interface Props {
  playbooks:  Playbook[];
  exercises:  ScenarioExercise[];
}

const STATUS_ICON = {
  tested:       <CheckCircle2 size={14} color="var(--low)" />,
  draft:        <Clock        size={14} color="var(--medium)" />,
  outdated:     <AlertCircle  size={14} color="var(--high)" />,
  'not-started':<XCircle      size={14} color="var(--critical)" />,
};

const STATUS_COLOR: Record<string, string> = {
  tested: 'var(--low)', draft: 'var(--medium)', outdated: 'var(--high)', 'not-started': 'var(--critical)',
};

export default function PlaybookPanel({ playbooks, exercises }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">
            <BookOpen size={14} color="var(--text-2)" />
            IR Playbooks ({playbooks.length})
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
            {playbooks.filter(p => p.status === 'tested').length} tested · {playbooks.filter(p => p.automatedSteps > 0).length} with automation
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {playbooks.map(pb => {
            const color = STATUS_COLOR[pb.status];
            const autoPct = Math.round((pb.automatedSteps / pb.steps) * 100);
            return (
              <div key={pb.id} style={{
                padding: '14px 20px', borderBottom: '1px solid var(--border)',
                display: 'flex', flexDirection: 'column', gap: 8,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {STATUS_ICON[pb.status]}
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{pb.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 1 }}>
                        v{pb.version} · {pb.steps} steps · {pb.automatedSteps} automated · Owner: {pb.owner}
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, fontWeight: 600,
                    background: `${color}15`, color, border: `1px solid ${color}30`,
                    textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                    {pb.status}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-3)', marginBottom: 3 }}>
                      <span>Readiness</span>
                      <span style={{ color: pb.readiness >= 80 ? 'var(--low)' : pb.readiness >= 60 ? 'var(--medium)' : 'var(--critical)', fontWeight: 700 }}>
                        {pb.readiness}%
                      </span>
                    </div>
                    <div style={{ height: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{
                        width: `${pb.readiness}%`, height: '100%', borderRadius: 2,
                        background: pb.readiness >= 80 ? 'var(--low)' : pb.readiness >= 60 ? 'var(--medium)' : 'var(--critical)',
                      }} />
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-3)', marginBottom: 3 }}>
                      <span>Automation</span>
                      <span style={{ color: 'var(--cyan)', fontWeight: 700 }}>{autoPct}%</span>
                    </div>
                    <div style={{ height: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: `${autoPct}%`, height: '100%', borderRadius: 2, background: 'var(--cyan)' }} />
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-3)', whiteSpace: 'nowrap' }}>
                    Last: {new Date(pb.lastTested).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    <span style={{ color: 'var(--text-3)' }}> · Next: </span>
                    {new Date(pb.nextTest).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">Scenario Exercises ({exercises.length})</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {exercises.map(ex => {
            const findingsOpen = ex.findingsCount - ex.closedFindings;
            return (
              <div key={ex.id} style={{
                padding: '16px 20px', borderBottom: '1px solid var(--border)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{ex.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>
                      {ex.type.replace('-', ' ')} · {new Date(ex.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · {ex.duration} · {ex.participants} participants
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontSize: 22, fontWeight: 900, fontFamily: 'JetBrains Mono',
                      color: ex.score >= 80 ? 'var(--low)' : ex.score >= 65 ? 'var(--medium)' : 'var(--high)',
                    }}>{ex.score}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-3)' }}>score</div>
                  </div>
                </div>

                <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 10 }}>
                  {ex.scenario}
                </div>

                <div style={{ display: 'flex', gap: 16, fontSize: 11 }}>
                  <span style={{ color: 'var(--text-3)' }}>
                    Findings: <strong style={{ color: 'var(--text-2)' }}>{ex.findingsCount}</strong>
                  </span>
                  <span style={{ color: ex.criticalFindings > 0 ? 'var(--critical)' : 'var(--text-3)' }}>
                    Critical: <strong>{ex.criticalFindings}</strong>
                  </span>
                  <span style={{ color: findingsOpen > 0 ? 'var(--medium)' : 'var(--low)' }}>
                    Open: <strong>{findingsOpen}</strong>
                  </span>
                  <span style={{ color: 'var(--text-3)' }}>
                    Next: <strong style={{ color: 'var(--cyan)' }}>
                      {new Date(ex.nextExercise).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </strong>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
