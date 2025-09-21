import { Header } from "@/components/layout/header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FounderAnalysis from "@/components/dashboard/founder-analysis";
import DocumentAnalysis from "@/components/dashboard/document-analysis";
import PeerBenchmarking from "@/components/dashboard/peer-benchmarking";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <Tabs defaultValue="founder-analysis" className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:w-auto sm:grid-cols-3 mb-6">
            <TabsTrigger value="founder-analysis">Founder Analysis</TabsTrigger>
            <TabsTrigger value="document-discrepancy">Document Discrepancy</TabsTrigger>
            <TabsTrigger value="peer-benchmarking">Peer Benchmarking</TabsTrigger>
          </TabsList>
          <TabsContent value="founder-analysis">
            <FounderAnalysis />
          </TabsContent>
          <TabsContent value="document-discrepancy">
            <DocumentAnalysis />
          </TabsContent>
          <TabsContent value="peer-benchmarking">
            <PeerBenchmarking />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
