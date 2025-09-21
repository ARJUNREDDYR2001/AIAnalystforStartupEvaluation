export const sampleFounderBios = `
Founder 1: Jane Doe, CEO
Jane is a repeat entrepreneur with a background in machine learning and data science. She previously founded and sold a successful B2B SaaS company, DataGlimpse, to a major tech giant. Her expertise lies in product development and strategic growth. She holds a Ph.D. in Computer Science from Stanford University. Before her entrepreneurial journey, Jane was a research scientist at a leading AI lab, publishing several papers on natural language processing.

Founder 2: John Smith, CTO
John is a seasoned engineering leader with over 15 years of experience building scalable, high-availability systems. Before co-founding this startup, he was a Principal Engineer at a well-known fintech company, where he led the development of their core transaction processing platform. John is passionate about building strong engineering cultures and is an active contributor to open-source projects. He dropped out of MIT to pursue his first startup, which had a modest exit.
`;

export const sampleDocumentText = `
Financial Projections Overview (Page 5):
Our company is projecting an Annual Recurring Revenue (ARR) of $15M by the end of Fiscal Year 2025. We have consistently achieved a 20% month-over-month growth rate.

Executive Summary (Page 2):
With our robust growth trajectory, we are on track to hit a $15M ARR by Q2 2026. This is driven by our strong user acquisition strategy.
`;

export type Startup = {
  id: number;
  name: string;
  industry: string;
  stage: string;
  arr: number;
  burnMultiple: number;
};

export const mockStartupData: Startup[] = [
  { id: 1, name: 'Innovate Inc.', industry: 'AI/ML', stage: 'Series A', arr: 5, burnMultiple: 1.5 },
  { id: 2, name: 'QuantumLeap', industry: 'Deep Tech', stage: 'Seed', arr: 1, burnMultiple: 3.2 },
  { id: 3, name: 'HealthGrid', industry: 'HealthTech', stage: 'Series B', arr: 12, burnMultiple: 1.1 },
  { id: 4, name: 'EcoSolutions', industry: 'ClimateTech', stage: 'Series A', arr: 4, burnMultiple: 2.0 },
  { id: 5, name: 'FinSecure', industry: 'FinTech', stage: 'Seed', arr: 2, burnMultiple: 2.5 },
  { id: 6, name: 'NextGen Retail', industry: 'E-commerce', stage: 'Series C', arr: 30, burnMultiple: 0.8 },
  { id: 7, name: 'DataWeave', industry: 'Data Analytics', stage: 'Series A', arr: 6, burnMultiple: 1.8 },
  { id: 8, name: 'BioSynth', industry: 'BioTech', stage: 'Seed', arr: 0.5, burnMultiple: 5.0 },
  { id: 9, name: 'CreatorFlow', industry: 'Creator Economy', stage: 'Seed', arr: 1.5, burnMultiple: 2.8 },
  { id: 10, name: 'LogiChain', industry: 'Logistics', stage: 'Series B', arr: 15, burnMultiple: 1.3 },
];
