import 'dotenv/config';
import app from './app';
import { WorkflowEngine } from './workflow/WorkflowEngine';

const PORT = Number(process.env.PORT ?? 3001);

function seedDemoWorkflows() {
  const w1 = WorkflowEngine.start('ai-intake', 'ChatGPT Enterprise — Code Review', 'j.okafor@org.internal', {
    vendor: 'OpenAI Inc.', useCase: 'Developer code review and documentation assistance',
    dataClassification: 'internal',
  });
  WorkflowEngine.transition(w1.id, { event: 'SUBMIT',           actor: 'j.okafor@org.internal', note: 'Initial submission' });
  WorkflowEngine.transition(w1.id, { event: 'APPROVE_SECURITY', actor: 'security@org.internal', note: 'No critical findings. Data isolation confirmed.' });
  WorkflowEngine.transition(w1.id, { event: 'APPROVE_LEGAL',    actor: 'legal@org.internal',    note: 'DPA signed. EU data residency confirmed.' });

  const w2 = WorkflowEngine.start('ai-intake', 'Copilot for Microsoft 365 — Analyst Productivity', 'm.williams@org.internal', {
    vendor: 'Microsoft Corporation', useCase: 'Email summarisation, report drafting, meeting notes',
    dataClassification: 'confidential',
  });
  WorkflowEngine.transition(w2.id, { event: 'SUBMIT',           actor: 'm.williams@org.internal' });

  const w3 = WorkflowEngine.start('ai-intake', 'Perplexity AI — Research Tool', 'p.sharma@org.internal', {
    vendor: 'Perplexity AI Inc.', useCase: 'Regulatory research and market intelligence',
    dataClassification: 'internal',
  });
  WorkflowEngine.transition(w3.id, { event: 'SUBMIT',           actor: 'p.sharma@org.internal' });
  WorkflowEngine.transition(w3.id, { event: 'REJECT_SECURITY',  actor: 'security@org.internal', note: 'Data exfiltration risk. Prompts contain internal data. Rejected pending DLP controls.' });

  const w4 = WorkflowEngine.start('risk-exception', 'Exception: Quarterly PAM Review (was Monthly)', 'd.tan@org.internal', {
    controlId: 'AC-2.4 — Account Review Frequency',
    justification: 'Tooling migration in progress — automated monthly review not yet available',
    compensatingControls: 'Enhanced logging, fortnightly manual sample of 20%',
    expiryDate: '2026-09-30',
  });
  WorkflowEngine.transition(w4.id, { event: 'SUBMIT',  actor: 'd.tan@org.internal' });
  WorkflowEngine.transition(w4.id, { event: 'APPROVE', actor: 'risk-owner@org.internal', note: 'Compensating controls adequate for 6 months.' });

  const w5 = WorkflowEngine.start('risk-exception', 'Exception: Legacy API — TLS 1.1 Support', 'a.chen@org.internal', {
    controlId: 'SC-8 — Transmission Confidentiality',
    justification: 'Third-party vendor cannot support TLS 1.2 until Q4 2026. Critical integration.',
    compensatingControls: 'VPN tunnel, IP allowlist, enhanced monitoring',
    expiryDate: '2026-12-31',
  });
  WorkflowEngine.transition(w5.id, { event: 'SUBMIT',   actor: 'a.chen@org.internal' });
  WorkflowEngine.transition(w5.id, { event: 'APPROVE',  actor: 'risk-owner@org.internal' });
  WorkflowEngine.transition(w5.id, { event: 'ESCALATE', actor: 'ciso@org.internal', note: 'Escalating to CRO given regulatory exposure.' });
}

seedDemoWorkflows();

app.listen(PORT, () => {
  console.log(`\n🚀  Lumina — CyberLens for GRC (API)`);
  console.log(`   REST:   http://localhost:${PORT}/api`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
  console.log(`   AI:     ${process.env.ANTHROPIC_API_KEY ? '✅ Live (Claude API)' : '⚠️  Fallback mode (set ANTHROPIC_API_KEY)'}\n`);
});
