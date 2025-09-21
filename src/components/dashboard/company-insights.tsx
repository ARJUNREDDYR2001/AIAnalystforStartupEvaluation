"use client";

import { useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, Building2, Zap, ShieldCheck, ShieldAlert, TrendingUp, AlertCircle, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateCompanyInsights, GenerateCompanyInsightsOutput } from "@/ai/flows/generate-company-insights";

interface CompanyInsightsProps {
  setAnalysisResult: (result: GenerateCompanyInsightsOutput | null) => void;
}

export default function CompanyInsights({ setAnalysisResult }: CompanyInsightsProps) {
  const [isPending, startTransition] = useTransition();
  const [companyName, setCompanyName] = useState("");
  const [result, setResult] = useState<GenerateCompanyInsightsOutput | null>(null);
  const { toast } = useToast();

  const handleAnalyzeCompany = () => {
    if (!companyName) {
      toast({
        title: "Company Name Required",
        description: "Please enter a company name to analyze.",
        variant: "destructive",
      });
      return;
    }

    setResult(null);
    setAnalysisResult(null);

    startTransition(async () => {
      try {
        const analysisResult = await generateCompanyInsights({ companyName });
        setResult(analysisResult);
        setAnalysisResult(analysisResult);
      } catch (error) {
        console.error("Error analyzing company:", error);
        toast({
          title: "Analysis Failed",
          description: "Could not generate insights for the company. Please try again.",
          variant: "destructive",
        });
      }
    });
  };
  
  const renderSwotList = (title: string, items: string[], icon: React.ReactNode) => (
    <div>
        <h4 className="font-semibold flex items-center mb-2">{icon}{title}</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
            {items.map((item, index) => (
            <li key={index} className="flex items-start">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-border mr-3 mt-1.5" />
                <span>{item}</span>
            </li>
            ))}
        </ul>
    </div>
  );

  return (
    <div className="grid gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Company Insights</CardTitle>
          <CardDescription>
            Get a real-time AI-generated overview, SWOT analysis, and competitor list for any company.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Enter company name (e.g., 'Google')"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyzeCompany()}
            />
            <Button
              onClick={handleAnalyzeCompany}
              disabled={isPending}
              className="w-full sm:w-auto"
            >
              {isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Search />
              )}
              Analyze Company
            </Button>
          </div>
        </CardContent>
      </Card>

      {isPending && (
        <Card className="flex items-center justify-center p-16">
          <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
          <p className="ml-4 text-muted-foreground">Generating insights...</p>
        </Card>
      )}

      {result && (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center"><Building2 className="mr-3" />Company Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{result.overview}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center"><Zap className="mr-3 text-orange-400" />SWOT Analysis</CardTitle>
                    <CardDescription>Strengths, Weaknesses, Opportunities, and Threats.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {renderSwotList("Strengths", result.swot.strengths, <ShieldCheck className="mr-2 text-green-400" />)}
                    {renderSwotList("Weaknesses", result.swot.weaknesses, <ShieldAlert className="mr-2 text-yellow-400" />)}
                    {renderSwotList("Opportunities", result.swot.opportunities, <TrendingUp className="mr-2 text-blue-400" />)}
                    {renderSwotList("Threats", result.swot.threats, <AlertCircle className="mr-2 text-red-400" />)}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center"><Users className="mr-3" />Potential Competitors</CardTitle>
                </CardHeader>
                <CardContent>
                     <ul className="space-y-2 text-sm text-muted-foreground">
                        {result.competitors.map((item, index) => (
                        <li key={index} className="flex items-start">
                            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-border mr-3 mt-1.5" />
                            <span>{item}</span>
                        </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
