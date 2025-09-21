"use client";

import { useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, FileCheck, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateInvestmentMemo, GenerateInvestmentMemoOutput } from "@/ai/flows/generate-investment-memo";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { Badge } from "../ui/badge";

interface InvestmentMemoProps {
    founderResult: any;
    docResult: any;
    peerResult: any;
    companyResult: any;
}

export default function InvestmentMemo({ founderResult, docResult, peerResult, companyResult }: InvestmentMemoProps) {
    const [isPending, startTransition] = useTransition();
    const [result, setResult] = useState<GenerateInvestmentMemoOutput | null>(null);
    const [weights, setWeights] = useState({ team: 40, product: 30, market: 30 });
    const { toast } = useToast();

    const isDataMissing = !founderResult || !peerResult || !companyResult || !docResult;

    const handleWeightChange = (newWeights: number[]) => {
        const [team, product, market] = newWeights;
        setWeights({ team, product, market });
    };

    const handleGenerateMemo = () => {
        if (isDataMissing) {
            toast({
                title: "Missing Analysis",
                description: "Please run all other analyses before generating the memo.",
                variant: "destructive",
            });
            return;
        }

        startTransition(async () => {
            try {
                const memoResult = await generateInvestmentMemo({
                    companyName: peerResult.companyName || "the startup",
                    founderAnalysis: JSON.stringify(founderResult),
                    documentAnalysis: JSON.stringify(docResult),
                    peerAnalysis: JSON.stringify(peerResult),
                    companyInsights: JSON.stringify(companyResult),
                    weights: weights,
                });
                setResult(memoResult);
            } catch (error) {
                console.error("Error generating investment memo:", error);
                toast({
                    title: "Memo Generation Failed",
                    description: "Could not generate the investment memo. Please try again.",
                    variant: "destructive",
                });
            }
        });
    };
    
    const getRecommendationClass = (recommendation: 'Invest' | 'Pass') => {
        return recommendation === 'Invest' ? 'text-green-400' : 'text-red-400';
    }
    
    const getScoreColor = (score: number) => {
        if (score >= 70) return "bg-green-500/20 text-green-300 border-green-400/30";
        if (score >= 50) return "bg-yellow-500/20 text-yellow-300 border-yellow-400/30";
        return "bg-red-500/20 text-red-300 border-red-400/30";
    };


    return (
        <div className="grid gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Investment Memo Generation</CardTitle>
                    <CardDescription>
                       Synthesize all analyses into a final investment recommendation, tailored to your priorities.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {isDataMissing && (
                         <div className="text-center text-muted-foreground p-8 rounded-lg border-2 border-dashed border-muted-foreground/30">
                            <AlertTriangle className="mx-auto h-12 w-12 text-yellow-400" />
                            <p className="mt-4 font-medium">Prerequisites Missing</p>
                            <p className="text-sm">Please run the analysis on the other tabs first.</p>
                        </div>
                    )}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Set Investment Priorities</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between mb-1">
                                    <Label htmlFor="team-weight">Team / Founder ({weights.team}%)</Label>
                                </div>
                                <Slider id="team-weight" value={[weights.team, weights.team + weights.product]} onValueChange={([team, productEnd]) => handleWeightChange([team, productEnd-team, 100-productEnd])} />
                            </div>
                             <div>
                                <div className="flex justify-between mb-1">
                                    <Label htmlFor="product-weight">Product / Docs ({weights.product}%)</Label>
                                </div>
                            </div>
                             <div>
                                <div className="flex justify-between mb-1">
                                    <Label htmlFor="market-weight">Market / Peers ({weights.market}%)</Label>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                     <Button
                        onClick={handleGenerateMemo}
                        disabled={isPending || isDataMissing}
                        className="w-full sm:w-auto"
                        >
                        {isPending ? <Loader2 className="animate-spin" /> : <FileCheck />}
                        Generate Investment Memo
                    </Button>
                </CardFooter>
            </Card>

            {isPending && (
                <Card className="flex items-center justify-center p-16">
                    <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
                    <p className="ml-4 text-muted-foreground">Synthesizing final recommendation...</p>
                </Card>
            )}

            {result && (
                <Card>
                    <CardHeader>
                         <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                           Final Recommendation
                            <Badge variant="outline" className={`${getScoreColor(result.overallScore)} text-lg`}>
                              Score: {result.overallScore}/100
                            </Badge>
                         </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className={`flex items-center text-2xl font-bold ${getRecommendationClass(result.recommendation)}`}>
                            {result.recommendation === 'Invest' ? <CheckCircle className="mr-3" /> : <XCircle className="mr-3" />}
                            Recommendation: {result.recommendation}
                        </div>
                        <div>
                            <h4 className="font-semibold text-lg mb-2">Executive Summary</h4>
                            <p className="text-muted-foreground">{result.executiveSummary}</p>
                        </div>
                         <div>
                            <h4 className="font-semibold text-lg mb-2">Detailed Rationale</h4>
                            <p className="text-muted-foreground whitespace-pre-line">{result.detailedRationale}</p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
