# VentureLens AI

VentureLens AI is a Next.js application that provides AI-powered due diligence tools for venture capitalists. It helps investors analyze startups by assessing founder backgrounds, detecting discrepancies in documents, benchmarking companies against their peers, and synthesizing all data into a final investment memo.

## Features

The application is organized into five interconnected dashboards:

### 1. Founder Analysis

This tool analyzes the biographies of startup founders to provide insights into their integrity and team cohesion.

-   **AI-Generated Integrity Score**: Get an A-F score based on an analysis of the founders' backgrounds.
-   **Green Lights & Red Flags**: Automatically identifies the top positive aspects and potential concerns.
-   **Due Diligence Questions**: Generates a list of targeted questions to ask during due diligence meetings.

### 2. Document Discrepancy Detection

This feature scans uploaded PDF documents (like pitch decks and financial statements) to identify inconsistencies in key numbers and claims.

-   **Automated Scanning**: The AI reads through the provided text to find conflicting information.
-   **Discrepancy Report**: Presents a clear report of any discrepancies found, including the conflicting source texts.

### 3. Peer Benchmarking

Benchmark a startup's performance against its industry peers using key metrics.

-   **Comparative Analysis**: Provides an AI-generated analysis of how a startup's ARR and burn multiple compare to the competition.
-   **Performance Radar Chart**: Visualizes the startup's performance across several key metrics against the peer average.

### 4. Company Insights

Generates a high-level overview of a company, including a SWOT analysis and a list of competitors.

-   **Company Overview**: A brief summary of the company's mission and business.
-   **SWOT Analysis**: Identifies strengths, weaknesses, opportunities, and threats.
-   **Competitor List**: Lists potential competitors in the market.

### 5. Investment Memo

The final step, this dashboard synthesizes all previous analyses into a single, actionable investment memo.

-   **Customizable Weighting**: Allows the investor to weigh the importance of Team, Product, and Market factors.
-   **Synthesized Recommendation**: Generates a final "Invest" or "Pass" recommendation based on all available data.
-   **Executive Summary & Rationale**: Provides a concise summary and a detailed explanation for the recommendation.

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (with App Router)
-   **AI**: [Genkit](https://firebase.google.com/docs/genkit)
-   **UI**: [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/)
-   **Components**: [ShadCN UI](https://ui.shadcn.com/)

## Getting Started

To run the application locally, follow these steps:

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run the Development Server**:
    The application uses `concurrently` to run both the Next.js frontend and the Genkit backend at the same time.

    ```bash
    npm run dev
    ```

3.  **Open the App**:
    Open [http://localhost:9002](http://localhost:9002) in your browser to see the application.
