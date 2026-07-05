import type { WorkflowDefinition } from '../types';

export const aiIntakeWorkflow: WorkflowDefinition = {
  id:          'ai-intake',
  name:        'AI Use-Case Intake & Approval',
  description: 'Governs the review and approval of new AI tools and use cases through Security, Legal, Privacy, and Governance gates.',
  initialState: 'draft',
  states: {
    draft: {
      label: 'Draft',
      transitions: {
        SUBMIT: { target: 'security-review', label: 'Submit for Review' },
        CANCEL: { target: 'cancelled',       label: 'Cancel'           },
      },
    },
    'security-review': {
      label: 'Security Review',
      transitions: {
        APPROVE_SECURITY: { target: 'legal-review', label: 'Approve — Security'  },
        REJECT_SECURITY:  { target: 'rejected',     label: 'Reject — Security'   },
        REQUEST_CHANGES:  { target: 'draft',         label: 'Request Changes'     },
      },
    },
    'legal-review': {
      label: 'Legal Review',
      transitions: {
        APPROVE_LEGAL: { target: 'privacy-review', label: 'Approve — Legal' },
        REJECT_LEGAL:  { target: 'rejected',       label: 'Reject — Legal'  },
        REQUEST_CHANGES: { target: 'draft',        label: 'Request Changes' },
      },
    },
    'privacy-review': {
      label: 'Privacy Review',
      transitions: {
        APPROVE_PRIVACY: { target: 'governance-board', label: 'Approve — Privacy' },
        REJECT_PRIVACY:  { target: 'rejected',         label: 'Reject — Privacy'  },
        REQUEST_CHANGES: { target: 'draft',            label: 'Request Changes'   },
      },
    },
    'governance-board': {
      label: 'Governance Board',
      transitions: {
        FINAL_APPROVE:   { target: 'approved',             label: 'Approve'            },
        CONDITIONAL:     { target: 'conditional-approval', label: 'Conditional Approve' },
        FINAL_REJECT:    { target: 'rejected',             label: 'Reject'              },
        REQUEST_CHANGES: { target: 'draft',                label: 'Request Changes'     },
      },
    },
    'conditional-approval': {
      label: 'Conditional Approval',
      transitions: {
        CONDITIONS_MET:  { target: 'approved', label: 'Conditions Met — Activate' },
        CONDITIONS_FAIL: { target: 'rejected', label: 'Conditions Not Met'        },
        REVOKE:          { target: 'rejected', label: 'Revoke Approval'           },
      },
    },
    approved:  { label: 'Approved',  terminal: true, transitions: {} },
    rejected:  { label: 'Rejected',  terminal: true, transitions: {} },
    cancelled: { label: 'Cancelled', terminal: true, transitions: {} },
  },
};

export const riskExceptionWorkflow: WorkflowDefinition = {
  id:          'risk-exception',
  name:        'Risk Exception Approval',
  description: 'Governs approval of exceptions to security controls, with compensating control review.',
  initialState: 'draft',
  states: {
    draft: {
      label: 'Draft',
      transitions: {
        SUBMIT:  { target: 'risk-owner-review', label: 'Submit' },
        CANCEL:  { target: 'cancelled',         label: 'Cancel' },
      },
    },
    'risk-owner-review': {
      label: 'Risk Owner Review',
      transitions: {
        APPROVE: { target: 'ciso-review', label: 'Approve to CISO'  },
        REJECT:  { target: 'rejected',    label: 'Reject'           },
      },
    },
    'ciso-review': {
      label: 'CISO Review',
      transitions: {
        APPROVE:  { target: 'approved', label: 'Approve Exception' },
        ESCALATE: { target: 'cro-review', label: 'Escalate to CRO' },
        REJECT:   { target: 'rejected',   label: 'Reject'          },
      },
    },
    'cro-review': {
      label: 'CRO Review',
      transitions: {
        APPROVE: { target: 'approved', label: 'Approve' },
        REJECT:  { target: 'rejected', label: 'Reject'  },
      },
    },
    approved:  { label: 'Approved',  terminal: true, transitions: {} },
    rejected:  { label: 'Rejected',  terminal: true, transitions: {} },
    cancelled: { label: 'Cancelled', terminal: true, transitions: {} },
  },
};
