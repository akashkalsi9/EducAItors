// Mock submission data for Screen 3.1 — Submission Review
// Reflects a near-complete submission: confirmed files, one warning link,
// one optional file included.

export const mockSubmission = {
  id:          'SUB-2026-001',
  studentName: 'Riya Sharma',
  studentId:   '2024MBA089',
  submittedAt: new Date().toISOString(),

  // Each item represents one submission element (file, link, etc.)
  // status: 'confirmed' | 'warning' | 'missing'
  // editRoute: where to go when user taps "Edit" for this item
  // mapsTo: criterion IDs from mockAssignment.rubric
  items: [
    {
      id:        'i1',
      name:      'Business Case Analysis.pdf',
      type:      'pdf',
      size:      '2.4 MB',
      status:    'confirmed',
      required:  true,
      slot:      'Primary file',
      editRoute: '/submit/upload',
      mapsTo:    ['c1', 'c2', 'c3'],
    },
    {
      id:        'i2',
      name:      'Financial Model.xlsx',
      type:      'xlsx',
      size:      '840 KB',
      status:    'confirmed',
      required:  true,
      slot:      'Financial Model',
      editRoute: '/submit/artifacts',
      mapsTo:    ['c2', 'c4'],
    },
    {
      id:          'i3',
      name:        'Supporting Document',
      type:        'link',
      platform:    'Google Drive',
      status:      'warning',
      required:    true,
      warningType: 'accessible-but-empty',
      consequence: 'This document appears to have no content. If the AI cannot find evidence here, this criterion may score zero.',
      editRoute:   '/submit/links',
      mapsTo:      ['c3'],
    },
    {
      id:        'i4',
      name:      'Presentation Deck.pptx',
      type:      'pptx',
      size:      '4.1 MB',
      status:    'confirmed',
      required:  false,
      slot:      'Presentation Deck',
      editRoute: '/submit/artifacts',
      mapsTo:    ['c4'],
    },
  ],
}
