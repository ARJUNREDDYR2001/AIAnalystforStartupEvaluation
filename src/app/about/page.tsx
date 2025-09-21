import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>About VentureLens AI</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            VentureLens AI is a comprehensive, AI-powered due diligence platform designed to empower venture capitalists and investors with deep, actionable insights into potential startup investments. In a world saturated with data, VentureLens AI cuts through the noise, providing a structured and intelligent framework for evaluating the most critical aspects of a startup.
          </p>
          <p>
            Our mission is to augment the decision-making process of investors by leveraging cutting-edge artificial intelligence to analyze complex, unstructured data, and present it in a clear, synthesized, and actionable format.
          </p>
          <h3 className="font-semibold text-lg text-foreground pt-4">Key Features:</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Founder Analysis:</strong> Go beyond the resume. Our AI analyzes founder biographies to generate an "Integrity Score," identifying key character strengths (Green Lights) and potential risks (Red Flags). It also generates targeted due diligence questions to guide investor conversations.
            </li>
            <li>
              <strong>Document Discrepancy Detection:</strong> Automatically scan multiple pitch decks, financial statements, and other PDF documents for inconsistencies. Our system flags conflicting numbers and claims, ensuring what you read on page 2 aligns with what's on page 20.
            </li>
            <li>
              <strong>Peer Benchmarking:</strong> Context is everything. Select up to two startups and compare their key metrics like ARR and burn multiple side-by-side. A dynamic radar chart provides an instant visual comparison, helping you see where a company leads and where it lags.
            </li>
            <li>
              <strong>Company Insights:</strong> Get the 30,000-foot view in seconds. The platform generates a concise company overview, a full SWOT (Strengths, Weaknesses, Opportunities, Threats) analysis, and a list of key competitors.
            </li>
            <li>
              <strong>Synthesized Investment Memo:</strong> The culmination of all analyses. VentureLens AI synthesizes all data points into a final investment memo. Investors can apply their own weighting to Team, Product, and Market factors to generate a final, data-driven "Invest" or "Pass" recommendation, complete with a detailed rationale.
            </li>
          </ul>
          <p className="pt-4">
            Built with a modern tech stack including Next.js, Genkit, and ShadCN UI, VentureLens AI is a fast, responsive, and powerful tool for the modern investor.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
