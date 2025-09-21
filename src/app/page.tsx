"use client"
import { useState } from 'react';
import { Header } from "@/components/layout/header";
import { SidebarProvider, Sidebar, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import FounderAnalysis from "@/components/dashboard/founder-analysis";
import DocumentAnalysis from "@/components/dashboard/document-analysis";
import PeerBenchmarking from "@/components/dashboard/peer-benchmarking";
import CompanyInsights from '@/components/dashboard/company-insights';
import { FileText, Users, Scaling, Building2 } from 'lucide-react';

type Tab = 'founder-analysis' | 'document-discrepancy' | 'peer-benchmarking' | 'company-insights';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('founder-analysis');

  const renderContent = () => {
    switch (activeTab) {
      case 'founder-analysis':
        return <FounderAnalysis />;
      case 'document-discrepancy':
        return <DocumentAnalysis />;
      case 'peer-benchmarking':
        return <PeerBenchmarking />;
      case 'company-insights':
        return <CompanyInsights />;
      default:
        return <FounderAnalysis />;
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
            </SidebarMenu>
          </Sidebar>
          <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto">
            {renderContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
