export const mockReadyResult = {
  state: 'ready',
  submissionId: 'SUB-2026-001',
  timestamp: '2026-04-02T14:32:00',
  instructorReviewEstimate: '48 hours',
}

export const mockWarningResult = {
  state: 'warning',
  submissionId: 'SUB-2026-001',
  timestamp: '2026-04-02T14:32:00',
  warnings: [
    {
      id: 'w1',
      criterionName: 'Criterion 3: Completeness',
      weight: '30%',
      element: 'Google Drive Link',
      issue: 'accessible-but-empty',
      consequence: 'The AI may not be able to score this criterion.',
    },
  ],
}

export const mockBlockerResult = {
  state: 'blocker',
  submissionId: 'SUB-2026-001',
  timestamp: '2026-04-02T14:32:00',
  blockers: [
    {
      id: 'b1',
      element: 'Business Case PDF',
      errorType: 'unreadable-file',
      description: 'Your PDF could not be read. It may be password protected or corrupted.',
      fixInstruction:
        'Export a new PDF from your original document. Make sure it is not password protected.',
    },
  ],
}
