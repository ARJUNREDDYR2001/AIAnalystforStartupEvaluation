"use client";

import { useState, useTransition, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { mockStartupData, Startup } from "@/lib/data";
import { benchmarkStartupAgainstPeers } from "@/ai/flows/benchmark-startup-against-peers";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, Zap } from "lucide-react";
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
  ResponsiveContainer,
} from "recharts";

type BenchmarkResult = {
  analysis: string;
  radarChartData: string;
};

type RadarDataItem = {
  metric: string;
  [key: string]: string | number;
};

export default function PeerBenchmarking() {
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);
  const [result, setResult] = useState<BenchmarkResult | null>(null);
  const { toast } = useToast();

  const filteredStartups = useMemo(() => {
    if (!searchQuery) return mockStartupData;
    return mockStartupData.filter((s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleSelectStartup = (startup: Startup) => {
    setSelectedStartup(startup);
    setResult(null);
    startTransition(async () => {
      try {
        const benchmarkResult = await benchmarkStartupAgainstPeers({
          companyName: startup.name,
          arr: startup.arr,
          burnMultiple: startup.burnMultiple,
          industry: startup.industry,
          stage: startup.stage,
        });
        setResult(benchmarkResult);
      } catch (error) {
        console.error("Error benchmarking startup:", error);
        toast({
          title: "Benchmarking Failed",
          description:
            "Could not generate the peer benchmark. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  const radarData: RadarDataItem[] = useMemo(() => {
    if (!result?.radarChartData) return [];
    try {
      return JSON.parse(result.radarChartData);
    } catch (e) {
      console.error("Failed to parse radar chart data", e);
      toast({
        title: "Chart Error",
        description: "Could not display the benchmark chart.",
        variant: "destructive",
      });
      return [];
    }
  }, [result, toast]);

  const chartConfig = useMemo(() => {
    if (!selectedStartup) return {};
    return {
      [selectedStartup.name]: {
        label: selectedStartup.name,
        color: "hsl(var(--chart-1))",
      },
      Peers: {
        label: "Peer Average",
        color: "hsl(var(--chart-2))",
      },
    };
  }, [selectedStartup]);


  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      <div className="md:col-span-2 lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Search Startups</CardTitle>
            <CardDescription>
              Find a startup from the pre-populated list to benchmark.
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
                      selectedStartup?.id === startup.id
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-muted"
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
        </Card>
      </div>

      <div className="md:col-span-2 space-y-8">
        {!selectedStartup && (
          <Card className="flex items-center justify-center p-16 h-full">
             <div className="text-center text-muted-foreground">
                <Search className="mx-auto h-12 w-12" />
                <p className="mt-4 font-medium">Select a Startup</p>
                <p className="text-sm">Choose a startup from the list to view its benchmark analysis.</p>
              </div>
          </Card>
        )}
        {isPending && (
          <Card className="flex items-center justify-center p-16">
            <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
            <p className="ml-4 text-muted-foreground">Generating analysis...</p>
          </Card>
        )}
        {result && selectedStartup && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span>
                    Benchmark: {selectedStartup.name}
                  </span>
                  <Badge variant="secondary">{selectedStartup.stage}</Badge>
                </CardTitle>
                <CardDescription>
                  AI-generated analysis comparing {selectedStartup.name} to its
                  peers.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                    <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">ARR</p>
                        <p className="text-2xl font-bold">${selectedStartup.arr}M</p>
                    </div>
                     <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Burn Multiple</p>
                        <p className="text-2xl font-bold">{selectedStartup.burnMultiple}x</p>
                    </div>
                </div>
                <div className="text-sm space-y-2 text-foreground/80">
                  <h4 className="font-semibold text-foreground flex items-center"><Zap className="w-4 h-4 mr-2 text-accent" />AI Analysis</h4>
                  <p>{result.analysis}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Performance Radar</CardTitle>
                <CardDescription>
                  Visual comparison across key metrics against peer average.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {radarData.length > 0 && (
                  <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px] sm:max-h-[350px]">
                    <RadarChart data={radarData}>
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="line" />}
                      />
                      <PolarAngleAxis dataKey="metric" />
                      <PolarGrid />
                      <Radar
                        name={selectedStartup.name}
                        dataKey={selectedStartup.name}
                        fill="var(--color-value)"
                        fillOpacity={0.6}
                        stroke="var(--color-value)"
                      />
                      <Radar
                        name="Peers"
                        dataKey="Peers"
                        fill="var(--color-average)"
                        fillOpacity={0.6}
                        stroke="var(--color-average)"
                      />
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
