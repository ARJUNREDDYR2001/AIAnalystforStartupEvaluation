"use client"
import { useState } from 'react';
import { Header } from "@/components/layout/header";
import { SidebarProvider, Sidebar, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import FounderAnalysis from "@/components/dashboard/founder-analysis";
import { DocumentAnalysis } from "@/components/dashboard/document-analysis";
import PeerBenchmarking from "@/components/dashboard/peer-benchmarking";
import CompanyInsights from '@/components/dashboard/company-insights';
import InvestmentMemo from '@/components/dashboard/investment-memo';
import { FileText, Users, Scaling, Building2, FileCheck } from 'lucide-react';

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
        <div className="flex flex-1 pt-16">
          <Sidebar side="left" className="glass-nav !border-r !border-white/10 md:w-64 fixed top-16 bottom-0 overflow-y-auto">
            <div className="p-4 space-y-6">
              {/* Analysis Section */}
              <div className="space-y-1">
                <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Analysis</h3>
                <SidebarMenu className="space-y-1">
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setActiveTab('founder-analysis')} 
                      isActive={activeTab === 'founder-analysis'}
                      className="w-full justify-start"
                    >
                      <Users className="w-4 h-4 mr-3" />
                      <span>Founder Analysis</span>
                      <span className="ml-auto text-xs text-muted-foreground">AI</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setActiveTab('document-discrepancy')} 
                      isActive={activeTab === 'document-discrepancy'}
                      className="w-full justify-start"
                    >
                      <FileText className="w-4 h-4 mr-3" />
                      <span>Document Analysis</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </div>

              {/* Market Research Section */}
              <div className="space-y-1">
                <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Market Research</h3>
                <SidebarMenu className="space-y-1">
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setActiveTab('peer-benchmarking')} 
                      isActive={activeTab === 'peer-benchmarking'}
                      className="w-full justify-start"
                    >
                      <Scaling className="w-4 h-4 mr-3" />
                      <span>Peer Benchmarking</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setActiveTab('company-insights')} 
                      isActive={activeTab === 'company-insights'}
                      className="w-full justify-start"
                    >
                      <Building2 className="w-4 h-4 mr-3" />
                      <span>Company Insights</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </div>

              {/* Output Section */}
              <div className="space-y-1">
                <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Output</h3>
                <SidebarMenu className="space-y-1">
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setActiveTab('investment-memo')} 
                      isActive={activeTab === 'investment-memo'}
                      className="w-full justify-start"
                    >
                      <FileCheck className="w-4 h-4 mr-3" />
                      <span>Investment Memo</span>
                      <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">New</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </div>
            </div>
          </Sidebar>
          <main className="flex-1 overflow-auto pl-0 md:pl-64 pt-4"> {/* Added left padding to account for sidebar */}
            <div className="p-4 md:p-6">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
