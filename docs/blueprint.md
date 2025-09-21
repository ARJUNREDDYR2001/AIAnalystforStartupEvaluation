# **App Name**: Fireside AI

## Core Features:

- Document Upload and Discrepancy Detection: Allows users to upload documents (PDF, PPT, or text) and highlights discrepancies in key numbers and claims using Gemini and the Natural Language API as a tool.
- Discrepancy Display: Presents a side-by-side comparison of the extracted information, highlighting contradictions with clickable provenance to the relevant document sections.
- Startup Search: Enables users to search for their startup within the pre-populated dataset, using keywords and filters. Mock data is included for demonstration.
- Peer Benchmarking Radar Chart: Dynamically benchmarks the user's startup against peers based on metrics like ARR and burn multiple. Displays results using a radar chart, auto-refreshed with dummy data.
- Founder Bios Input: Accepts input of founder bios or sample text for analysis.
- Integrity and Cohesion Score Generation: Generates an integrity and cohesion score (A-F) for founders based on their bios using Gemini and the Natural Language API as a tool. Outputs top green lights and red flags.
- Due Diligence Question Generation: Auto-generates founder-specific due-diligence questions based on the AI analysis. The model will reason, as a tool, to create targeted questions. The results are displayed on a scorecard UI.

## Style Guidelines:

- Primary color: A deep teal (#134E5E) to convey trust and sophistication, avoiding the cliche of typical 'finance' greens.
- Background color: A light, desaturated teal (#D9E7E7) to provide a clean, unobtrusive backdrop.
- Accent color: A warm, contrasting orange (#E07A5F) to highlight key actions and insights.
- Body and headline font: 'Inter' (sans-serif) for a modern, neutral, and highly readable interface.
- Code font: 'Source Code Pro' for displaying any code snippets within the application.
- Use a set of minimalist icons to represent different features and data points, ensuring clarity and ease of use.
- Employ a clean, tabbed dashboard layout to separate the three core features. Each tab will have clear headings and descriptions.