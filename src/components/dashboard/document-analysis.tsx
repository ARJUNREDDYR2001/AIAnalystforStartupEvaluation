"use client";

import { useState, useTransition, useRef } from "react";
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
import { Loader2, FileUp, AlertTriangle, Quote, CheckCircle2, FileText, X } from "lucide-react";
import { detectDocumentDiscrepancies, DetectDocumentDiscrepanciesOutput } from "@/ai/flows/detect-document-discrepancies";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DocumentAnalysisProps {
  setAnalysisResult: (result: DetectDocumentDiscrepanciesOutput | null) => void;
}

export default function DocumentAnalysis({ setAnalysisResult }: DocumentAnalysisProps) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<DetectDocumentDiscrepanciesOutput | null>(null);
  const [documentContent, setDocumentContent] = useState<string>("");
  const [fileNames, setFileNames] = useState<string[]>([]);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }
    
    // Dynamically import pdf-parse only on the client-side when needed
    const pdf = (await import('pdf-parse')).default;

    const newFileNames: string[] = [];
    let combinedContent = "";

    const filePromises = Array.from(files).map(file => {
      return new Promise<string>((resolve, reject) => {
        newFileNames.push(file.name);
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            if (e.target?.result) {
              const data = await pdf(Buffer.from(e.target.result as ArrayBuffer));
              resolve(data.text);
            } else {
              reject(new Error("Failed to read file."));
            }
          } catch (error) {
            console.error(`Error parsing ${file.name}:`, error);
            toast({
              title: "PDF Parsing Error",
              description: `Could not parse ${file.name}. It might be corrupted or protected.`,
              variant: "destructive",
            });
            reject(error);
          }
        };
        reader.onerror = (error) => {
            reject(error);
        }
        reader.readAsArrayBuffer(file);
      });
    });

    try {
      const contents = await Promise.all(filePromises);
      combinedContent = contents.join("\n\n---\n\n");
      setDocumentContent(combinedContent);
      setFileNames(newFileNames);
      setResult(null);
      setAnalysisResult(null);
    } catch (error) {
      console.error("Failed to process one or more files.", error);
    }
  };


  const handleAnalyzeDocument = () => {
    if (!documentContent) {
      toast({
        title: "No Document",
        description: "Please upload a document to analyze.",
        variant: "destructive",
      });
      return;
    }
    setResult(null);
    setAnalysisResult(null);
    startTransition(async () => {
      try {
        const analysisResult = await detectDocumentDiscrepancies({
          documentContent: documentContent,
          documentType: "pdf",
        });
        setResult(analysisResult);
        setAnalysisResult(analysisResult);
        if (analysisResult.discrepancies.length === 0) {
          toast({
            title: "Analysis Complete",
            description: "No discrepancies were found in the document(s).",
          });
        }
      } catch (error) {
        console.error("Error analyzing document:", error);
        toast({
          title: "Analysis Failed",
          description: "Could not analyze the document(s). Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  const clearFiles = () => {
    setDocumentContent("");
    setFileNames([]);
    setResult(null);
    setAnalysisResult(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  return (
    <div className="grid gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Document Discrepancy Detection</CardTitle>
          <CardDescription>
            Upload one or more PDF documents to automatically detect discrepancies in key numbers and claims.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-6 sm:p-12 cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors"
          >
             <Input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf"
                multiple
              />
            <div className="text-center">
              <FileUp className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-sm text-muted-foreground">
                Click to browse or drag and drop PDF files
              </p>
            </div>
          </div>
          {fileNames.length > 0 && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between rounded-md border bg-muted/50 p-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm font-medium truncate" title={fileNames.join(', ')}>{fileNames.join(', ')}</span>
                  </div>
                   <Button variant="ghost" size="icon" onClick={clearFiles} className="h-6 w-6 flex-shrink-0">
                      <X className="h-4 w-4" />
                      <span className="sr-only">Clear all files</span>
                    </Button>
                </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleAnalyzeDocument}
            disabled={isPending || !documentContent}
            className="w-full sm:w-auto sm:ml-auto"
          >
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <FileUp />
            )}
            Analyze Documents
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
              {result.discrepancies.length} {result.discrepancies.length === 1 ? 'discrepancy' : 'discrepancies'} found in the document(s).
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
