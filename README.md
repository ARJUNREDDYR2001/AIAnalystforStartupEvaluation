# Fireside AI

Fireside AI is a Next.js application that provides AI-powered due diligence tools for venture capitalists. It helps investors analyze startups by assessing founder backgrounds, detecting discrepancies in documents, and benchmarking companies against their peers.

## Features

The application is organized into three main dashboards:

### 1. Founder Analysis

This tool analyzes the biographies of startup founders to provide insights into their integrity and team cohesion.

-   **AI-Generated Integrity Score**: Get an A-F score based on an analysis of the founders' backgrounds.
-   **Green Lights & Red Flags**: Automatically identifies the top positive aspects and potential concerns.
-   **Due Diligence Questions**: Generates a list of targeted questions to ask during due diligence meetings.

### 2. Document Discrepancy Detection

This feature scans uploaded documents (like pitch decks and financial statements) to identify inconsistencies in key numbers and claims.

-   **Automated Scanning**: The AI reads through the provided text to find conflicting information.
-   **Discrepancy Report**: Presents a clear report of any discrepancies found, including the conflicting source texts.

### 3. Peer Benchmarking

Benchmark a startup's performance against its industry peers using key metrics.

-   **Comparative Analysis**: Provides an AI-generated analysis of how a startup's ARR and burn multiple compare to the competition.
-   **Performance Radar Chart**: Visualizes the startup's performance across several key metrics against the peer average.

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
    Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.
