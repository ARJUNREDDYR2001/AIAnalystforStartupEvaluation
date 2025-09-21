"use client"
import { useState } from 'react';
import Link from 'next/link';
import { Sidebar, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import FounderAnalysis from "@/components/dashboard/founder-analysis";
import { DocumentAnalysis } from "@/components/dashboard/document-analysis";
import PeerBenchmarking from "@/components/dashboard/peer-benchmarking";
import CompanyInsights from '@/components/dashboard/company-insights';
import InvestmentMemo from '@/components/dashboard/investment-memo';
import { FileText, Users, Scaling, Building2, FileCheck, Info, Phone, LayoutDashboard } from 'lucide-react';
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
      <div className="flex gap-8">
        <Sidebar side="left" className="glass-nav !border-r !border-white/10 w-64 hidden md:flex flex-col" collapsible="none">
           <SidebarMenu className="p-4 space-y-2 flex-1">
              <SidebarMenuItem>
                <Button variant="ghost" asChild className="justify-start w-full">
                    <Link href="/"><LayoutDashboard />Dashboard</Link>
                </Button>
              </SidebarMenuItem>
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
            <div className="p-4 mt-auto border-t border-border/50">
              <nav className="flex flex-col gap-2">
                  <Button variant="ghost" asChild className="justify-start">
                    <Link href="/about"><Info className="mr-2"/>About</Link>
                  </Button>
                  <Button variant="ghost" asChild className="justify-start">
                    <Link href="/contact"><Phone className="mr-2"/>Contact</Link>
                  </Button>
              </nav>
            </div>
        </Sidebar>

        {/* Mobile Sidebar */}
        <Sidebar side="left" className="glass-nav !border-r !border-white/10 md:hidden">
          <SidebarMenu className="p-4 space-y-2">
            <SidebarMenuItem>
              <Button variant="ghost" asChild className="justify-start w-full">
                  <Link href="/"><LayoutDashboard />Dashboard</Link>
              </Button>
            </SidebarMenuItem>
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
          <div className="p-4 mt-auto border-t border-border/50">
            <nav className="flex flex-col gap-2">
                <Button variant="ghost" asChild className="justify-start">
                  <Link href="/about"><Info className="mr-2"/>About</Link>
                </Button>
                <Button variant="ghost" asChild className="justify-start">
                  <Link href="/contact"><Phone className="mr-2"/>Contact</Link>
                </Button>
            </nav>
          </div>
        </Sidebar>
        
        <div className="flex-1">
          {renderContent()}
        </div>
      </div>
  );
}
