import { motion } from "framer-motion";
import { Bot, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Agent {
  id: string;
  name: string;
  status: "active" | "idle" | "processing" | "error";
  task?: string;
  processed: number;
}

const agents: Agent[] = [
  { id: "1", name: "Ingestion Agent", status: "processing", task: "Processing MIL-STD-1553B.pdf", processed: 847 },
  { id: "2", name: "Classification Agent", status: "active", task: "Classifying batch #4521", processed: 2341 },
  { id: "3", name: "Validation Agent", status: "idle", processed: 1205 },
  { id: "4", name: "Compliance Agent", status: "active", task: "Enforcing ITAR labels", processed: 956 },
  { id: "5", name: "Workflow Agent", status: "processing", task: "Triggering approval chain", processed: 423 },
];

const statusConfig = {
  active: { icon: CheckCircle, class: "status-online", label: "Active" },
  idle: { icon: Clock, class: "bg-muted-foreground", label: "Idle" },
  processing: { icon: Bot, class: "status-processing", label: "Processing" },
  error: { icon: AlertTriangle, class: "status-error", label: "Error" },
};

export function AgentActivityCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="doc-card col-span-2"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">AI Agent Activity</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">5 agents deployed</span>
          <div className="w-2 h-2 rounded-full status-online" />
        </div>
      </div>
      
      <div className="space-y-3">
        {agents.map((agent, index) => {
          const config = statusConfig[agent.status];
          const StatusIcon = config.icon;
          
          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className={cn(
                "agent-card flex items-center gap-4",
                agent.status === "processing" && "active"
              )}
            >
              <div className="p-2 rounded-lg bg-primary/10">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{agent.name}</span>
                  <div className={cn("w-2 h-2 rounded-full", config.class)} />
                </div>
                {agent.task ? (
                  <p className="text-sm text-muted-foreground truncate">{agent.task}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">Awaiting tasks...</p>
                )}
              </div>
              
              <div className="text-right">
                <p className="font-mono text-sm text-primary">{agent.processed.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">processed</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
