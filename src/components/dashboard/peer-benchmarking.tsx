"use client";

import { useState, useTransition, useMemo, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockStartupData, Startup } from "@/lib/data";
import { benchmarkStartupAgainstPeers, BenchmarkStartupAgainstPeersOutput } from "@/ai/flows/benchmark-startup-against-peers";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, Zap, ArrowRightLeft, X } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  PolarRadiusAxis,
} from "recharts";

interface PeerBenchmarkingProps {
  setAnalysisResult: (result: any | null) => void;
}

type RadarDataItem = {
  metric: string;
  [key: string]: string | number;
};

export default function PeerBenchmarking({ setAnalysisResult }: PeerBenchmarkingProps) {
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStartups, setSelectedStartups] = useState<[Startup | null, Startup | null]>([null, null]);
  const [result, setResult] = useState<BenchmarkStartupAgainstPeersOutput | null>(null);
  const { toast } = useToast();

  const filteredStartups = useMemo(() => {
    if (!searchQuery) return mockStartupData;
    return mockStartupData.filter((s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleSelectStartup = (startup: Startup) => {
    setSelectedStartups(prev => {
      if (!prev[0] || prev[0].id === startup.id) return [startup, prev[1]];
      if (!prev[1] || prev[1].id === startup.id) return [prev[0], startup];
      return [startup, null]; // Reset if both are selected
    });
  };
  
  const handleClearSelection = () => {
    setSelectedStartups([null, null]);
    setResult(null);
    setAnalysisResult(null);
  }

  const handleRunAnalysis = useCallback(() => {
    const [startup1] = selectedStartups;
    if (!startup1) {
      toast({
        title: "Startup Not Selected",
        description: "Please select at least one startup to analyze.",
        variant: "destructive",
      });
      return;
    }

    setResult(null);
    setAnalysisResult(null);
    startTransition(async () => {
      try {
        // Note: The flow is designed for one startup. We will call it with the first one.
        // The comparison logic is primarily on the client-side for this UI implementation.
        const benchmarkResult = await benchmarkStartupAgainstPeers({
          companyName: startup1.name,
          arr: startup1.arr,
          burnMultiple: startup1.burnMultiple,
          industry: startup1.industry,
          stage: startup1.stage,
        });
        setResult(benchmarkResult);
        
        // We pass both startups to the parent for the investment memo.
        setAnalysisResult({
            ...benchmarkResult,
            selectedStartups,
            // The radar data from the flow is for one company + peers. We will create our own.
            radarChartData: createRadarData(selectedStartups)
        });

      } catch (error) {
        console.error("Error benchmarking startup:", error);
        toast({
          title: "Benchmarking Failed",
          description: "Could not generate the peer benchmark. Please try again.",
          variant: "destructive",
        });
      }
    });
  }, [selectedStartups, setAnalysisResult, toast]);

  const createRadarData = (startups: [Startup | null, Startup | null]): RadarDataItem[] => {
      const [s1, s2] = startups;
      const data: RadarDataItem[] = [
          { metric: 'ARR ($M)', company1: s1?.arr || 0, company2: s2?.arr || 0 },
          { metric: 'Burn Multiple (x)', company1: s1?.burnMultiple || 0, company2: s2?.burnMultiple || 0 },
          // Add more metrics here if available, e.g., from a more detailed API
          { metric: 'Valuation ($M)', company1: (s1?.arr || 0) * 10, company2: (s2?.arr || 0) * 10 }, // Mocked
          { metric: 'Team Size', company1: (s1?.arr || 0) * 5, company2: (s2?.arr || 0) * 5 }, // Mocked
          { metric: 'Market Share (%)', company1: (s1?.arr || 0) * 1.5, company2: (s2?.arr || 0) * 1.5 }, // Mocked
      ];
      return data;
  }
  
  const radarData: RadarDataItem[] = useMemo(() => {
    if (selectedStartups[0] === null && selectedStartups[1] === null) return [];
    return createRadarData(selectedStartups);
  }, [selectedStartups]);


  const chartConfig = useMemo(() => {
    const [s1, s2] = selectedStartups;
    return {
      company1: {
        label: s1?.name || 'Company 1',
        color: "hsl(var(--chart-1))",
      },
      company2: {
        label: s2?.name || 'Company 2',
        color: "hsl(var(--chart-2))",
      },
    };
  }, [selectedStartups]);


  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      <div className="md:col-span-2 lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Select Startups to Compare</CardTitle>
            <CardDescription>
              Choose up to two startups from the list to benchmark.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {filteredStartups.map((startup) => (
                  <button
                    key={startup.id}
                    onClick={() => handleSelectStartup(startup)}
                    className={`w-full text-left p-3 rounded-md transition-colors ${
                      selectedStartups.some(s => s?.id === startup.id)
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <p className="font-semibold">{startup.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {startup.industry} - {startup.stage}
                    </p>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
             <Button
                onClick={handleRunAnalysis}
                disabled={isPending || !selectedStartups[0]}
                className="w-full"
              >
                {isPending ? <Loader2 className="animate-spin" /> : <Zap />}
                Analyze
              </Button>
              <Button
                  onClick={handleClearSelection}
                  variant="outline"
                  className="w-full"
                  disabled={!selectedStartups[0] && !selectedStartups[1]}
                >
                  <X className="mr-2 h-4 w-4" />
                  Clear Selection
                </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="md:col-span-2 space-y-8">
        {!selectedStartups[0] && !selectedStartups[1] && (
          <Card className="flex items-center justify-center p-16 h-full">
             <div className="text-center text-muted-foreground">
                <Search className="mx-auto h-12 w-12" />
                <p className="mt-4 font-medium">Select Startups</p>
                <p className="text-sm">Choose one or two startups to begin the analysis.</p>
              </div>
          </Card>
        )}
        
        {isPending && (
          <Card className="flex items-center justify-center p-16">
            <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
            <p className="ml-4 text-muted-foreground">Generating analysis...</p>
          </Card>
        )}

        {selectedStartups[0] && (
          <>
             <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                    <ArrowRightLeft className="mr-3" />
                    Side-by-Side Comparison
                </CardTitle>
                <CardDescription>
                  Key metrics for the selected companies. AI analysis is based on the first selected startup.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedStartups.map((startup, i) => startup && (
                    <div key={startup.id} className="p-4 bg-muted/30 rounded-lg border">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg" style={{color: chartConfig[`company${i+1}` as keyof typeof chartConfig].color}}>{startup.name}</h3>
                            <Badge variant="secondary">{startup.stage}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-center">
                             <div className="p-2 bg-background/50 rounded-md">
                                <p className="text-xs text-muted-foreground">ARR</p>
                                <p className="text-xl font-bold">${startup.arr}M</p>
                            </div>
                             <div className="p-2 bg-background/50 rounded-md">
                                <p className="text-xs text-muted-foreground">Burn Multiple</p>
                                <p className="text-xl font-bold">{startup.burnMultiple}x</p>
                            </div>
                        </div>
                    </div>
                ))}
              </CardContent>
               {result && (
                <CardFooter>
                    <div className="text-sm space-y-2 text-foreground/80 w-full">
                        <h4 className="font-semibold text-foreground flex items-center"><Zap className="w-4 h-4 mr-2 text-orange-400" />AI Analysis on {selectedStartups[0]?.name}</h4>
                        <p className="text-muted-foreground">{result.analysis}</p>
                    </div>
                </CardFooter>
               )}
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Radar</CardTitle>
                <CardDescription>
                  Visual comparison across key metrics.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {radarData.length > 0 && (
                  <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[350px]">
                    <RadarChart data={radarData}>
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="line" />}
                      />
                      <PolarAngleAxis dataKey="metric" />
                      <PolarRadiusAxis angle={30} domain={[0, 'dataMax + 10']} />
                      <PolarGrid />
                      {selectedStartups[0] && <Radar
                        name={selectedStartups[0].name}
                        dataKey="company1"
                        fill="var(--color-company1)"
                        fillOpacity={0.5}
                        stroke="var(--color-company1)"
                      />}
                       {selectedStartups[1] && <Radar
                        name={selectedStartups[1].name}
                        dataKey="company2"
                        fill="var(--color-company2)"
                        fillOpacity={0.5}
                        stroke="var(--color-company2)"
                      />}
                      <ChartLegend />
                    </RadarChart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
