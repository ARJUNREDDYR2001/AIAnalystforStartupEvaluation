"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import FounderAnalysis from "@/components/dashboard/founder-analysis";
import { DocumentAnalysis } from "@/components/dashboard/document-analysis";
import PeerBenchmarking from "@/components/dashboard/peer-benchmarking";
import CompanyInsights from "@/components/dashboard/company-insights";
import InvestmentMemo from "@/components/dashboard/investment-memo";
import {
  FileText,
  Users,
  Scaling,
  Building2,
  FileCheck,
  PanelLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Tab =
  | "founder-analysis"
  | "document-discrepancy"
  | "peer-benchmarking"
  | "company-insights"
  | "investment-memo";

const DashboardSidebarContent = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}) => {
  const menuItems = [
    {
      id: "founder-analysis",
      icon: <Users className="w-5 h-5" />,
      label: "Founder Analysis",
    },
    {
      id: "document-discrepancy",
      icon: <FileText className="w-5 h-5" />,
      label: "Document Discrepancy",
    },
    {
      id: "peer-benchmarking",
      icon: <Scaling className="w-5 h-5" />,
      label: "Peer Benchmarking",
    },
    {
      id: "company-insights",
      icon: <Building2 className="w-5 h-5" />,
      label: "Company Insights",
    },
    {
      id: "investment-memo",
      icon: <FileCheck className="w-5 h-5" />,
      label: "Investment Memo",
    },
  ];

  return (
    <SidebarMenu className="p-3 space-y-1 flex-1">
      {menuItems.map((item) => (
        <SidebarMenuItem key={item.id}>
          <SidebarMenuButton
            onClick={() => setActiveTab(item.id as Tab)}
            isActive={activeTab === item.id}
            className={`group flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === item.id
                ? "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white"
                : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700/50"
            }`}
          >
            <span
              className={`mr-3 ${
                activeTab === item.id
                  ? "text-orange-500"
                  : "text-slate-500 group-hover:text-orange-500"
              }`}
            >
              {item.icon}
            </span>
            {item.label}
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("founder-analysis");

  // State to hold analysis results
  const [founderResult, setFounderResult] = useState(null);
  const [docResult, setDocResult] = useState(null);
  const [peerResult, setPeerResult] = useState(null);
  const [companyResult, setCompanyResult] = useState(null);

  const renderContent = () => {
    switch (activeTab) {
      case "founder-analysis":
        return <FounderAnalysis setAnalysisResult={setFounderResult} />;
      case "document-discrepancy":
        return <DocumentAnalysis setAnalysisResult={setDocResult} />;
      case "peer-benchmarking":
        return <PeerBenchmarking setAnalysisResult={setPeerResult} />;
      case "company-insights":
        return <CompanyInsights setAnalysisResult={setCompanyResult} />;
      case "investment-memo":
        return (
          <InvestmentMemo
            founderResult={founderResult}
            docResult={docResult}
            peerResult={peerResult}
            companyResult={companyResult}
          />
        );
      default:
        return <FounderAnalysis setAnalysisResult={setFounderResult} />;
    }
  };

  return (
    <div className="flex h-full">
      {/* Desktop Sidebar */}
      <div className="hidden md:block min-w-[300px] top-0 left-0 h-full w-64 border-r border-slate-700 bg-slate-800 shadow-lg z-40 overflow-y-auto transition-all duration-200 ">
        <div className="p-4">
          <DashboardSidebarContent
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <Sidebar
          side="left"
          className="!border-r border-slate-700 bg-slate-800 pt-16"
        >
          <div className="pt-4">
            <DashboardSidebarContent
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
        </Sidebar>
      </div>

      {/* Main Content */}
      <div className=" pl-5">
        {/* Mobile Menu Button */}
        <div className="md:hidden fixed top-16 z-30 bg-slate-800/95 backdrop-blur-md p-4 shadow-sm">
          <SidebarTrigger>
            <PanelLeft className="mr-2 text-slate-200" />
            <span className="text-slate-200">Menu</span>
          </SidebarTrigger>
        </div>

        {/* Content */}
        <div className="p-4  w-full">
          <div className="rounded-xl p-6">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}
