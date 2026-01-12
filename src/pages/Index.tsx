import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Bot, Upload, Shield, FolderOpen, Clock, TrendingUp, AlertCircle } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { AgentActivityCard } from "@/components/dashboard/AgentActivityCard";
import { RecentDocuments } from "@/components/dashboard/RecentDocuments";
import { ComplianceOverview } from "@/components/dashboard/ComplianceOverview";
import { DocumentCategories } from "@/components/dashboard/DocumentCategories";
import { AISearchPanel } from "@/components/search/AISearchPanel";
import { DocumentUpload } from "@/components/upload/DocumentUpload";
import { DocumentExplorer } from "@/components/documents/DocumentExplorer";
import heroBg from "@/assets/hero-bg.jpg";

const Dashboard = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="space-y-6"
  >
    {/* Stats Grid */}
    <div className="grid grid-cols-4 gap-4">
      <StatsCard
        title="Total Documents"
        value={2847}
        change="+124 this week"
        changeType="positive"
        icon={FileText}
        delay={0}
      />
      <StatsCard
        title="Documents Processed"
        value={5772}
        change="by AI agents today"
        changeType="neutral"
        icon={Bot}
        delay={0.1}
      />
      <StatsCard
        title="Pending Review"
        value={23}
        change="-8 from yesterday"
        changeType="positive"
        icon={Clock}
        delay={0.2}
      />
      <StatsCard
        title="Compliance Rate"
        value="94.4%"
        change="+2.1% improvement"
        changeType="positive"
        icon={Shield}
        delay={0.3}
      />
    </div>

    {/* Main Content Grid */}
    <div className="grid grid-cols-3 gap-4">
      <AgentActivityCard />
      <ComplianceOverview />
    </div>

    <div className="grid grid-cols-3 gap-4">
      <RecentDocuments />
      <DocumentCategories />
    </div>
  </motion.div>
);

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "documents":
        return <DocumentExplorer />;
      case "search":
        return (
          <div className="h-[calc(100vh-8rem)]">
            <AISearchPanel />
          </div>
        );
      case "upload":
        return <DocumentUpload />;
      case "agents":
        return (
          <div className="grid grid-cols-2 gap-6">
            <AgentActivityCard />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="doc-card"
            >
              <h3 className="text-lg font-semibold text-foreground mb-4">Agent Performance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-success" />
                    <span className="text-foreground">Processing Speed</span>
                  </div>
                  <span className="text-success font-mono">+23% faster</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-primary" />
                    <span className="text-foreground">Classification Accuracy</span>
                  </div>
                  <span className="text-primary font-mono">96.8%</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-warning" />
                    <span className="text-foreground">Human Review Required</span>
                  </div>
                  <span className="text-warning font-mono">12 documents</span>
                </div>
              </div>
            </motion.div>
          </div>
        );
      case "compliance":
        return (
          <div className="grid grid-cols-2 gap-6">
            <ComplianceOverview />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="doc-card"
            >
              <h3 className="text-lg font-semibold text-foreground mb-4">Recent Audit Logs</h3>
              <div className="space-y-3">
                {[
                  { action: "Document classified", doc: "MIL-STD-1553B.pdf", user: "AI Agent", time: "2 min ago" },
                  { action: "Access granted", doc: "HAL Agreement", user: "Col. Sharma", time: "15 min ago" },
                  { action: "Retention applied", doc: "Tejas Drawings", user: "Compliance Agent", time: "1 hour ago" },
                  { action: "Document uploaded", doc: "BrahMos Report", user: "Maj. Singh", time: "2 hours ago" },
                ].map((log, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                    <div>
                      <p className="text-sm text-foreground">{log.action}</p>
                      <p className="text-xs text-muted-foreground">{log.doc}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{log.user}</p>
                      <p className="text-xs text-muted-foreground">{log.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-background tactical-grid">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          {/* Hero Banner - only on dashboard */}
          {activeTab === "dashboard" && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-xl overflow-hidden mb-6 h-48"
            >
              <img 
                src={heroBg} 
                alt="Defence Command Center" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-transparent" />
              <div className="absolute inset-0 flex items-center p-8">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    Intelligent Document Management System
                  </h1>
                  <p className="text-muted-foreground max-w-xl">
                    AI-powered document processing with autonomous agents for defence-grade 
                    classification, compliance enforcement, and intelligent search.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Page Title for non-dashboard pages */}
          {activeTab !== "dashboard" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h1 className="text-2xl font-bold text-foreground capitalize">{activeTab}</h1>
              <p className="text-sm text-muted-foreground">
                {activeTab === "documents" && "Browse and manage all classified documents"}
                {activeTab === "search" && "Search documents using natural language queries"}
                {activeTab === "upload" && "Upload new documents for AI classification"}
                {activeTab === "agents" && "Monitor AI agent activity and performance"}
                {activeTab === "compliance" && "Review compliance status and audit logs"}
              </p>
            </motion.div>
          )}

          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
