"use client"
import { useState } from 'react';
import Link from 'next/link';
import { Header } from "@/components/layout/header";
import { SidebarProvider, Sidebar, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import FounderAnalysis from "@/components/dashboard/founder-analysis";
import { DocumentAnalysis } from "@/components/dashboard/document-analysis";
import PeerBenchmarking from "@/components/dashboard/peer-benchmarking";
import CompanyInsights from '@/components/dashboard/company-insights';
import InvestmentMemo from '@/components/dashboard/investment-memo';
import { FileText, Users, Scaling, Building2, FileCheck, Info, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Tab = 'founder-analysis' | 'document-discrepancy' | 'peer-benchmarking' | 'company-insights' | 'investment-memo';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('founder-analysis');

  // State to hold analysis results
  const [founderResult, setFounderResult] = useState(null);
  const [docResult, setDocResult] = useState(null);
  const [peerResult, setPeerResult] = useState(null);
  const [companyResult, setCompanyResult] = useState(null);

  const renderContent = () => {
    switch (activeTab) {
      case 'founder-analysis':
        return <FounderAnalysis setAnalysisResult={setFounderResult} />;
      case 'document-discrepancy':
        return <DocumentAnalysis setAnalysisResult={setDocResult} />;
      case 'peer-benchmarking':
        return <PeerBenchmarking setAnalysisResult={setPeerResult} />;
      case 'company-insights':
        return <CompanyInsights setAnalysisResult={setCompanyResult} />;
      case 'investment-memo':
        return <InvestmentMemo founderResult={founderResult} docResult={docResult} peerResult={peerResult} companyResult={companyResult} />;
      default:
        return <FounderAnalysis setAnalysisResult={setFounderResult} />;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1">
          <Sidebar side="left" className="glass-nav !border-r !border-white/10 md:w-64">
            <SidebarMenu className="p-4 space-y-2">
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setActiveTab('founder-analysis')} isActive={activeTab === 'founder-analysis'}><Users />Founder Analysis</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setActiveTab('document-discrepancy')} isActive={activeTab === 'document-discrepancy'}><FileText />Document Discrepancy</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setActiveTab('peer-benchmarking')} isActive={activeTab === 'peer-benchmarking'}><Scaling />Peer Benchmarking</SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setActiveTab('company-insights')} isActive={activeTab === 'company-insights'}><Building2 />Company Insights</SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setActiveTab('investment-memo')} isActive={activeTab === 'investment-memo'}><FileCheck />Investment Memo</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>

             <div className="p-4 mt-auto md:hidden">
                <nav className="flex flex-col gap-2">
                    <Button variant="ghost" asChild className="justify-start">
                    <Link href="/about"><Info />About</Link>
                    </Button>
                    <Button variant="ghost" asChild className="justify-start">
                    <Link href="/contact"><Phone />Contact</Link>
                    </Button>
                </nav>
            </div>

          </Sidebar>
          <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto">
            {renderContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
