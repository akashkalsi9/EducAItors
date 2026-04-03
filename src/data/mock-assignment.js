export const mockAssignment = {
  id: 'ASSIGN-001',
  firstSubmission: true,
  title: 'Business Case Analysis — Module 3',
  courseName: 'MBA Strategic Management',
  instructorName: 'Dr. Prasad Sharma',
  deadline: '2026-04-03T23:59:00',
  submissionStatus: 'not-started', // not-started | in-progress | submitted | resubmission-needed
  requiredArtifacts: [
    { id: 'a1', name: 'Business Case PDF',    type: 'pdf',         required: true  },
    { id: 'a2', name: 'Financial Model',       type: 'xlsx',        required: true  },
    { id: 'a3', name: 'Presentation Deck',     type: 'pptx',        required: false },
    { id: 'a4', name: 'Problem Statement',     type: 'handwritten', required: true, requiresOCR: true },
  ],
  // External links — Screen 2.3
  requiredLinks: [
    {
      id: 'l1',
      name: 'Figma Prototype',
      platform: 'Figma',
      required: true,
      placeholder: 'Paste your Figma prototype link here',
      simulatedResult: 'accessible',
    },
    {
      id: 'l2',
      name: 'Supporting Document',
      platform: 'Google Drive',
      required: true,
      placeholder: 'Paste your Google Drive link here',
      simulatedResult: 'permission-blocked',
    },
  ],
  optionalLinks: [
    {
      id: 'l3',
      name: 'Additional Reference',
      platform: 'Generic',
      required: false,
      placeholder: 'Paste a link (optional)',
      simulatedResult: 'empty-link',
    },
  ],
  brief: {
    overview:
      "This assignment requires you to select a real-world organisation facing a significant strategic challenge and develop a comprehensive business case for a recommended course of action. You will draw on the Module 3 analytical frameworks — Porter's Five Forces, SWOT, PESTEL, and Value Chain Analysis — to diagnose the competitive environment, identify the root cause of the challenge, and evaluate at least three strategic alternatives before making a final recommendation.",
    context:
      "The organisation you choose must be publicly listed or have sufficient publicly available information to support evidence-based analysis. You may not use the case studies already covered in Modules 1 and 2. Your recommendation must be financially grounded: include a high-level cost-benefit analysis, projected impact on revenue or market share, and a risk mitigation plan. The problem statement (submitted as a handwritten scan) must be written independently without AI assistance and serves as your personal framing of the challenge before any research begins.",
    objectives: [
      'Diagnose a real business challenge using at least two Module 3 frameworks with supporting evidence',
      'Evaluate a minimum of three strategic alternatives against defined decision criteria',
      'Produce a financially grounded recommendation with cost-benefit analysis and risk assessment',
      'Demonstrate academic rigour through properly cited sources and a structured argument',
    ],
    deliverables: [
      { label: 'Business Case PDF', detail: '2,500–3,500 words. Structured sections: Executive Summary, Problem Framing, Environmental Analysis, Alternatives, Recommendation, Financial Impact, Risk Plan, References.' },
      { label: 'Financial Model (Excel)', detail: 'Cost-benefit model with at least 3-year projection. Must include assumptions sheet, scenario analysis (base / optimistic / pessimistic), and a summary dashboard tab.' },
      { label: 'Presentation Deck (optional)', detail: '8–12 slides summarising the case for a C-suite audience. If submitted, this will be used for the in-class presentation in Week 6.' },
      { label: 'Handwritten Problem Statement', detail: 'One A4 page, written before any research. Describe the problem in your own words, your initial hypothesis, and what you expect to find. Submit as a clear photograph (JPG/PNG).' },
    ],
    notes: 'AI tools may be used to assist with research synthesis and editing but all strategic analysis, frameworks, and recommendations must reflect your own thinking. Any AI-generated content must be disclosed in an appendix. Undisclosed AI use will be treated as academic misconduct.',
    pdfUrl: '#',
  },
  rubric: [
    {
      id: 'c1',
      name: 'Problem Framing & Analysis',
      weight: 20,
      levels: [
        { score: 10, label: 'Exceeds expectations',              description: 'The problem is precisely framed with compelling evidence. Root cause analysis is rigorous, multi-layered, and shows original thinking beyond the frameworks.' },
        { score: 8,  label: 'Meets expectations',                description: 'Problem is clearly framed and well-evidenced. Frameworks are applied correctly and the root cause is identified with logical reasoning.' },
        { score: 6,  label: 'Meets with minor issues',           description: 'Problem is identified but framing lacks precision or depth. Framework application is present but surface-level in places.' },
        { score: 4,  label: 'Below expectations',                description: 'Significant gaps in problem framing. Limited use of frameworks with minimal supporting evidence.' },
        { score: 2,  label: 'Significant issues identified',     description: 'Problem is poorly defined or misidentified. Little or no structured analysis present.' },
      ],
    },
    {
      id: 'c2',
      name: 'Strategic Framework Application',
      weight: 20,
      levels: [
        { score: 10, label: 'Exceeds expectations',              description: 'All frameworks applied with depth and nuance. Insights from different frameworks are synthesised into a coherent strategic picture.' },
        { score: 8,  label: 'Meets expectations',                description: 'Two or more frameworks applied correctly with good supporting evidence. Insights are clearly linked to the recommendation.' },
        { score: 6,  label: 'Meets with minor issues',           description: 'Most themes and elements reflected but depth or systematic mapping could be improved.' },
        { score: 4,  label: 'Below expectations',                description: 'Significant gaps in framework mapping. Lack of systematic structure or evidence.' },
        { score: 2,  label: 'Significant issues identified',     description: 'Frameworks largely missing or incorrectly applied. No clear systematic approach.' },
      ],
    },
    {
      id: 'c3',
      name: 'Quality of Recommendation',
      weight: 20,
      levels: [
        { score: 10, label: 'Exceeds expectations',              description: 'Recommendation is strongly justified, financially grounded, and anticipates counter-arguments. Alternatives evaluated against explicit criteria.' },
        { score: 8,  label: 'Meets expectations',                description: 'Clear recommendation with sound rationale. At least three alternatives evaluated. Financial impact estimated.' },
        { score: 6,  label: 'Meets with minor issues',           description: 'Recommendation present but justification is thin or alternatives are not fully evaluated.' },
        { score: 4,  label: 'Below expectations',                description: 'Recommendation lacks justification or financial grounding. Alternatives not meaningfully compared.' },
        { score: 2,  label: 'Significant issues identified',     description: 'No clear recommendation or alternatives. Analysis does not support conclusions.' },
      ],
    },
    {
      id: 'c4',
      name: 'Financial Grounding',
      weight: 15,
      levels: [
        { score: 10, label: 'Exceeds expectations',              description: 'Financial model is comprehensive with scenario analysis, clear assumptions, and a well-structured dashboard. Projections are realistic and well-defended.' },
        { score: 8,  label: 'Meets expectations',                description: 'Financial model covers cost-benefit and 3-year projection. Assumptions are documented and scenarios included.' },
        { score: 6,  label: 'Meets with minor issues',           description: 'Financial model present but incomplete — missing scenarios or assumption sheet.' },
        { score: 4,  label: 'Below expectations',                description: 'Significant details missing from the financial model. Projections are unsupported.' },
        { score: 2,  label: 'Significant issues identified',     description: 'Financial model largely absent or fundamentally flawed.' },
      ],
    },
    {
      id: 'c5',
      name: 'Completeness',
      weight: 15,
      levels: [
        { score: 10, label: 'Exceeds expectations',              description: 'All required sections present and fully developed. Supplementary content (appendices, disclosures) adds value.' },
        { score: 8,  label: 'Meets expectations',                description: 'All required sections present and adequately developed. Minor gaps do not affect the overall quality.' },
        { score: 6,  label: 'Meets with minor issues',           description: 'Most of the assignment requirements are met. Some sections are underdeveloped.' },
        { score: 4,  label: 'Below expectations',                description: 'Several requirements missing or incomplete.' },
        { score: 2,  label: 'Significant issues identified',     description: 'Work is largely incomplete with major sections missing.' },
      ],
    },
    {
      id: 'c6',
      name: 'Clarity & Attention to Detail',
      weight: 10,
      levels: [
        { score: 10, label: 'Exceeds expectations',              description: 'Writing is precise, well-structured, and compelling. Referencing is complete and consistent. Document is professionally formatted.' },
        { score: 8,  label: 'Meets expectations',                description: 'Writing is clear and well-organised. Referencing is mostly complete. Minor formatting inconsistencies.' },
        { score: 6,  label: 'Meets with minor issues',           description: 'At least 80% of the work is clearly written and referenced. Some structural or formatting issues.' },
        { score: 4,  label: 'Below expectations',                description: 'At least 50% of the work meets clarity standards. Referencing gaps are noticeable.' },
        { score: 2,  label: 'Significant issues identified',     description: 'Only 20% of the work meets acceptable clarity or referencing standards.' },
      ],
    },
  ],
}
