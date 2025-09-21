"use client";

import { useState, useTransition, useMemo, useCallback, useEffect } from "react";
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
import { Loader2, Search, Zap, ArrowRightLeft, X, RefreshCw } from "lucide-react";
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
import { Checkbox } from "../ui/checkbox";

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
  const [selectedStartups, setSelectedStartups] = useState<Startup[]>([]);
  const [primaryStartup, setPrimaryStartup] = useState<Startup | null>(null);
  const [result, setResult] = useState<BenchmarkStartupAgainstPeersOutput | null>(null);
  const { toast } = useToast();

  const filteredStartups = useMemo(() => {
    if (!searchQuery) return mockStartupData;
    return mockStartupData.filter((s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleSelectStartup = (startup: Startup, checked: boolean) => {
    const isSelected = selectedStartups.some(s => s.id === startup.id);
    
    if (checked && !isSelected) {
      if (selectedStartups.length >= 2) {
        toast({
          title: "Limit Reached",
          description: "You can only select up to two startups to compare.",
          variant: "destructive",
        });
        return;
      }
      setSelectedStartups(prev => [...prev, startup]);
    } else if (!checked && isSelected) {
      setSelectedStartups(prev => prev.filter(s => s.id !== startup.id));
    }
  };

  const handleClearSelection = () => {
    setSelectedStartups([]);
    setResult(null);
    setAnalysisResult(null);
    setPrimaryStartup(null);
  }

  const handleSetPrimary = (startup: Startup) => {
    if (primaryStartup?.id !== startup.id) {
        setPrimaryStartup(startup);
    }
  };

  const swapPrimary = () => {
    if (selectedStartups.length === 2 && primaryStartup) {
      const other = selectedStartups.find(s => s.id !== primaryStartup.id);
      if (other) {
        setPrimaryStartup(other);
      }
    }
  }

  const runAnalysis = useCallback((startupToAnalyze: Startup) => {
    if (!startupToAnalyze) return;

    setResult(null);
    startTransition(async () => {
      try {
        const benchmarkResult = await benchmarkStartupAgainstPeers({
          companyName: startupToAnalyze.name,
          arr: startupToAnalyze.arr,
          burnMultiple: startupToAnalyze.burnMultiple,
          industry: startupToAnalyze.industry,
          stage: startupToAnalyze.stage,
        });
        setResult(benchmarkResult);

      } catch (error) {
        console.error("Error benchmarking startup:", error);
        toast({
          title: "Benchmarking Failed",
          description: "Could not generate the peer benchmark. Please try again.",
          variant: "destructive",
        });
      }
    });
  }, [toast]);

  useEffect(() => {
    const [s1] = selectedStartups;
    // If only one is selected, it must be primary
    if (selectedStartups.length === 1) {
      setPrimaryStartup(s1);
    } 
    // If selections are cleared, clear primary
    else if (selectedStartups.length === 0) {
        setPrimaryStartup(null);
        setResult(null);
    } 
    // If a primary existed but was deselected, make the other one primary
    else if (selectedStartups.length === 2 && primaryStartup && !selectedStartups.some(s => s.id === primaryStartup.id)) {
        const newPrimary = selectedStartups.find(s => s.id !== primaryStartup.id);
        setPrimaryStartup(newPrimary || null);
    }
    // If there was no primary and now there are two, make the first one primary
    else if (selectedStartups.length === 2 && !primaryStartup) {
        setPrimaryStartup(s1);
    }

  }, [selectedStartups, primaryStartup]);

  useEffect(() => {
    // Run analysis whenever the primary startup changes
    if (primaryStartup) {
      runAnalysis(primaryStartup);
    }
  }, [primaryStartup, runAnalysis]);

  useEffect(() => {
    // Pass results up to parent for investment memo
    setAnalysisResult({
        ...result,
        selectedStartups,
        // The radar data from the flow is for one company + peers. We will create our own.
        radarChartData: createRadarData(selectedStartups)
    });
  }, [result, selectedStartups, setAnalysisResult]);

  const createRadarData = (startups: Startup[]): RadarDataItem[] => {
      const [s1, s2] = startups;
      const data: RadarDataItem[] = [
          { metric: 'ARR ($M)', company1: s1?.arr || 0, company2: s2?.arr || 0 },
          { metric: 'Burn Multiple (x)', company1: s1?.burnMultiple || 0, company2: s2?.burnMultiple || 0 },
          { metric: 'Valuation ($M)', company1: (s1?.arr || 0) * 10, company2: (s2?.arr || 0) * 10 }, // Mocked
          { metric: 'Team Size', company1: (s1?.arr || 0) * 5, company2: (s2?.arr || 0) * 5 }, // Mocked
          { metric: 'Market Share (%)', company1: (s1?.arr || 0) * 1.5, company2: (s2?.arr || 0) * 1.5 }, // Mocked
      ];
      return data;
  }
  
  const radarData: RadarDataItem[] = useMemo(() => {
    if (selectedStartups.length === 0) return [];
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
              <div className="space-y-1 pr-4">
                {filteredStartups.map((startup) => {
                  const isSelected = selectedStartups.some(s => s.id === startup.id);
                  return (
                  <div
                    key={startup.id}
                    className={`flex items-center w-full text-left p-2 rounded-md transition-colors ${
                      isSelected ? "bg-accent/50" : "hover:bg-muted/50"
                    }`}
                  >
                    <Checkbox 
                        id={`startup-${startup.id}`}
                        checked={isSelected}
                        onCheckedChange={(checked) => handleSelectStartup(startup, !!checked)}
                        className="mr-3"
                    />
                    <label htmlFor={`startup-${startup.id}`} className="flex-1 cursor-pointer">
                        <p className="font-semibold">{startup.name}</p>
                        <p className="text-sm text-muted-foreground">
                        {startup.industry} - {startup.stage}
                        </p>
                    </label>
                  </div>
                )})}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
              <Button
                  onClick={handleClearSelection}
                  variant="outline"
                  className="w-full"
                  disabled={selectedStartups.length === 0}
                >
                  <X className="mr-2 h-4 w-4" />
                  Clear Selection
                </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="md:col-span-2 space-y-8">
        {selectedStartups.length === 0 ? (
          <Card className="flex items-center justify-center p-16 h-full">
             <div className="text-center text-muted-foreground">
                <Search className="mx-auto h-12 w-12" />
                <p className="mt-4 font-medium">Select Startups</p>
                <p className="text-sm">Choose one or two startups to begin the analysis.</p>
              </div>
          </Card>
        ) : (
          <>
             <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center"><ArrowRightLeft className="mr-3" />Side-by-Side Comparison</div>
                    {selectedStartups.length === 2 && (
                      <Button variant="ghost" size="sm" onClick={swapPrimary} title="Swap primary analysis">
                        <RefreshCw className="mr-2 h-4 w-4" /> Swap
                      </Button>
                    )}
                </CardTitle>
                <CardDescription>
                  Key metrics for the selected companies. AI analysis runs on the primary startup.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedStartups.map((startup, i) => startup && (
                    <div key={startup.id} onClick={() => handleSetPrimary(startup)} className={`p-4 bg-muted/30 rounded-lg border-2 cursor-pointer transition-colors ${primaryStartup?.id === startup.id ? 'border-primary' : 'border-transparent hover:border-muted-foreground/50'}`}>
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg" style={{color: chartConfig[i === 0 ? 'company1' : 'company2'].color}}>{startup.name}</h3>
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
               {(isPending || result) && (
                <CardFooter className="flex-col items-start gap-4">
                    <div className="text-sm space-y-2 text-foreground/80 w-full">
                        <h4 className="font-semibold text-foreground flex items-center"><Zap className="w-4 h-4 mr-2 text-orange-400" />AI Analysis on {primaryStartup?.name}</h4>
                        {isPending ? (
                             <div className="flex items-center text-muted-foreground">
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                <p>Generating analysis...</p>
                            </div>
                        ) : result ? (
                            <p className="text-muted-foreground">{result.analysis}</p>
                        ) : null }
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
