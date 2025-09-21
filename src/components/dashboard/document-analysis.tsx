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
import { Loader2, FileUp, AlertTriangle, Quote, CheckCircle2 } from "lucide-react";
import { sampleDocumentText } from "@/lib/data";
import { detectDocumentDiscrepancies, DetectDocumentDiscrepanciesOutput } from "@/ai/flows/detect-document-discrepancies";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function DocumentAnalysis() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<DetectDocumentDiscrepanciesOutput | null>(null);
  const { toast } = useToast();

  const handleAnalyzeDocument = () => {
    setResult(null);
    startTransition(async () => {
      try {
        const analysisResult = await detectDocumentDiscrepancies({
          documentContent: sampleDocumentText,
          documentType: "text",
        });
        setResult(analysisResult);
        if (analysisResult.discrepancies.length === 0) {
          toast({
            title: "Analysis Complete",
            description: "No discrepancies were found in the document.",
          });
        }
      } catch (error) {
        console.error("Error analyzing document:", error);
        toast({
          title: "Analysis Failed",
          description: "Could not analyze the document. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="grid gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Document Discrepancy Detection</CardTitle>
          <CardDescription>
            Upload a document (PDF, PPT, or text) to automatically detect
            discrepancies in key numbers and claims.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex w-full items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-6 sm:p-12">
            <div className="text-center">
              <FileUp className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-sm text-muted-foreground">
                For this demo, we'll use a sample document.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleAnalyzeDocument}
            disabled={isPending}
            className="w-full sm:w-auto sm:ml-auto"
          >
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <FileUp />
            )}
            Analyze Sample Document
          </Button>
        </CardFooter>
      </Card>

      {isPending && (
        <Card className="flex items-center justify-center p-16">
          <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
          <p className="ml-4 text-muted-foreground">Scanning for discrepancies...</p>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Discrepancy Report</CardTitle>
            <CardDescription>
              {result.discrepancies.length} discrepancies found in the document.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result.discrepancies.length > 0 ? (
              <div className="space-y-6">
                {result.discrepancies.map((d, i) => (
                  <Alert key={i} variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Discrepancy #{i + 1}: {d.description}</AlertTitle>
                    <AlertDescription className="mt-4 space-y-4">
                        <div className="flex items-start gap-3">
                           <Quote className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                           <p className="font-code text-sm italic">"{d.sourceText1}"</p>
                        </div>
                        <div className="flex items-start gap-3">
                           <Quote className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                           <p className="font-code text-sm italic">"{d.sourceText2}"</p>
                        </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground p-8">
                <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
                <p className="mt-4 font-medium">No Discrepancies Found</p>
                <p className="text-sm">The automated analysis did not find any conflicting information.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
