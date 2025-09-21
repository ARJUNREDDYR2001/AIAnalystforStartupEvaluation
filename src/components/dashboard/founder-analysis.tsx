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
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CheckCircle2, XCircle, BrainCircuit } from "lucide-react";
import { sampleFounderBios } from "@/lib/data";
import { generateIntegrityScore, GenerateIntegrityScoreOutput } from "@/ai/flows/generate-integrity-score";
import { generateDueDiligenceQuestions } from "@/ai/flows/generate-due-diligence-questions";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "../ui/badge";


interface FounderAnalysisProps {
  setAnalysisResult: (result: GenerateIntegrityScoreOutput | null) => void;
}


export default function FounderAnalysis({ setAnalysisResult }: FounderAnalysisProps) {
  const [isPending, startTransition] = useTransition();
  const [isQuestionsPending, startQuestionsTransition] = useTransition();
  const [bios, setBios] = useState("");
  const [result, setResult] = useState<GenerateIntegrityScoreOutput | null>(null);
  const [questions, setQuestions] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAnalyzebios = () => {
    if (!bios) {
      toast({
        title: "Input Required",
        description: "Please enter founder bios or load sample data.",
        variant: "destructive",
      });
      return;
    }

    setResult(null);
    setQuestions(null);
    setAnalysisResult(null);

    startTransition(async () => {
      try {
        const scoreResult = await generateIntegrityScore({ founderBios: bios });
        setResult(scoreResult);
        setAnalysisResult(scoreResult);
        generateQuestions(scoreResult);
      } catch (error) {
        console.error("Error generating integrity score:", error);
        toast({
          title: "Analysis Failed",
          description: "Could not generate the integrity score. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  const generateQuestions = (scoreResult: GenerateIntegrityScoreOutput) => {
    startQuestionsTransition(async () => {
      try {
        const questionsResult = await generateDueDiligenceQuestions({
          founderBios: bios,
          integrityScore: scoreResult.integrityScore,
          cohesionScore: "N/A", // Cohesion score not provided by the flow
          topGreenLights: scoreResult.greenLights,
          topRedFlags: scoreResult.redFlags,
        });
        setQuestions(questionsResult.dueDiligenceQuestions);
      } catch (error) {
        console.error("Error generating questions:", error);
        toast({
          title: "Question Generation Failed",
          description: "Could not generate due diligence questions.",
          variant: "destructive",
        });
      }
    });
  };

  const loadSample = () => {
    setBios(sampleFounderBios);
    setResult(null);
    setQuestions(null);
  };

  const getScoreColor = (score: string) => {
    if (["A", "B"].includes(score)) return "bg-green-500/20 text-green-300 border-green-400/30";
    if (["C"].includes(score)) return "bg-yellow-500/20 text-yellow-300 border-yellow-400/30";
    if (["D", "F"].includes(score)) return "bg-red-500/20 text-red-300 border-red-400/30";
    return "bg-muted";
  };
  
  const parseList = (text: string) => text.split('\n').map(item => item.trim().replace(/^\d+\.\s*/, '')).filter(Boolean);

  return (
    <div className=" w-full">
      <Card>
        <CardHeader>
          <CardTitle>Founder Background</CardTitle>
          <CardDescription>
            Enter the bios for the founding team to generate an integrity and
            cohesion analysis.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste founder bios here..."
            value={bios}
            onChange={(e) => setBios(e.target.value)}
            className="min-h-[200px] text-sm"
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={loadSample}>
            Load Sample
          </Button>
          <Button onClick={handleAnalyzebios} disabled={isPending} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600">
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <BrainCircuit />
            )}
            Analyze Bios
          </Button>
        </CardFooter>
      </Card>

      <div className="space-y-8">
        {isPending && (
          <Card className="flex items-center justify-center p-16">
            <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
            <p className="ml-4 text-muted-foreground">Analyzing...</p>
          </Card>
        )}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                Founder Analysis Report
                <Badge variant="outline" className={`${getScoreColor(result.integrityScore)} text-lg`}>
                  Score: {result.integrityScore}
                </Badge>
              </CardTitle>
              <CardDescription>
                AI-generated integrity score and key observations.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center text-green-400">
                  <CheckCircle2 className="mr-2" /> Green Lights
                </h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {parseList(result.greenLights).map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center text-red-400">
                  <XCircle className="mr-2" /> Red Flags
                </h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {parseList(result.redFlags).map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {isQuestionsPending && (
           <Card className="flex items-center justify-center p-16">
            <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
            <p className="ml-4 text-muted-foreground">Generating Questions...</p>
          </Card>
        )}

        {questions && (
          <Card>
            <CardHeader>
              <CardTitle>Suggested Due Diligence Questions</CardTitle>
              <CardDescription>
                AI-generated questions to guide your conversation with the founders.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                {parseList(questions).map((q, i) => (
                  <li key={i} className="flex items-start">
                    <div className="flex-shrink-0 w-3 h-3 rounded-full bg-orange-400/50 border border-orange-400 mr-3 mt-1.5" />
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
