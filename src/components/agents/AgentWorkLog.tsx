import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bot,
  User,
  Clock,
  FileText,
  CheckCircle,
  AlertTriangle,
  Filter,
  Calendar,
  ChevronDown,
  Activity,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UserProfile {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar: string;
  clearanceLevel: string;
}

interface AgentTask {
  id: string;
  agentName: string;
  agentType: string;
  taskName: string;
  description: string;
  status: "completed" | "in_progress" | "failed";
  duration: number; // in seconds
  timestamp: string;
  documentsProcessed: number;
}

interface UserWorkSummary {
  user: UserProfile;
  totalTasks: number;
  totalTimeWorked: number; // in seconds
  completedTasks: number;
  failedTasks: number;
  tasks: AgentTask[];
}

// Sample data for defence organization users
const sampleUsers: UserProfile[] = [
  { id: "u1", name: "User Alpha", role: "Project Lead", department: "R&D Division", avatar: "A", clearanceLevel: "Level 4" },
  { id: "u2", name: "User Bravo", role: "Systems Analyst", department: "Technical Wing", avatar: "B", clearanceLevel: "Level 3" },
  { id: "u3", name: "User Charlie", role: "Documentation Lead", department: "Quality Assurance", avatar: "C", clearanceLevel: "Level 3" },
  { id: "u4", name: "User Delta", role: "Operations Manager", department: "Operations Center", avatar: "D", clearanceLevel: "Level 4" },
  { id: "u5", name: "User Echo", role: "Security Officer", department: "Security Division", avatar: "E", clearanceLevel: "Level 5" },
];

// Sample agent tasks per user
const generateTasks = (userId: string): AgentTask[] => {
  const taskTemplates = [
    { name: "Document Classification", type: "Classification Agent", description: "Automated security classification" },
    { name: "Metadata Extraction", type: "Extraction Agent", description: "Extracted document metadata and tags" },
    { name: "Compliance Verification", type: "Compliance Agent", description: "Verified document compliance status" },
    { name: "Content Indexing", type: "Search Agent", description: "Indexed document for AI search" },
    { name: "Retention Analysis", type: "Retention Agent", description: "Analyzed document retention requirements" },
    { name: "Access Log Audit", type: "Audit Agent", description: "Audited document access patterns" },
    { name: "Quality Check", type: "QA Agent", description: "Performed quality assurance checks" },
    { name: "Format Conversion", type: "Conversion Agent", description: "Converted document format" },
  ];

  const baseCount = parseInt(userId.slice(1)) * 3;
  return taskTemplates.slice(0, 5 + (parseInt(userId.slice(1)) % 3)).map((template, index) => ({
    id: `${userId}-task-${index}`,
    agentName: template.type,
    agentType: template.type.split(" ")[0].toLowerCase(),
    taskName: template.name,
    description: template.description,
    status: index === 0 && userId === "u2" ? "in_progress" : index === 3 && userId === "u3" ? "failed" : "completed",
    duration: 120 + Math.floor(Math.random() * 480),
    timestamp: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 7)).toISOString(),
    documentsProcessed: 1 + Math.floor(Math.random() * 5),
  }));
};

const userWorkData: UserWorkSummary[] = sampleUsers.map((user) => {
  const tasks = generateTasks(user.id);
  return {
    user,
    totalTasks: tasks.length,
    totalTimeWorked: tasks.reduce((sum, task) => sum + task.duration, 0),
    completedTasks: tasks.filter((t) => t.status === "completed").length,
    failedTasks: tasks.filter((t) => t.status === "failed").length,
    tasks,
  };
});

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
};

const formatRelativeTime = (isoString: string): string => {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  return "Just now";
};

const StatusBadge = ({ status }: { status: AgentTask["status"] }) => {
  const styles = {
    completed: "bg-success/20 text-success border-success/30",
    in_progress: "bg-primary/20 text-primary border-primary/30",
    failed: "bg-destructive/20 text-destructive border-destructive/30",
  };
  
  const icons = {
    completed: CheckCircle,
    in_progress: Activity,
    failed: AlertTriangle,
  };
  
  const Icon = icons[status];
  
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border", styles[status])}>
      <Icon className="w-3 h-3" />
      {status.replace("_", " ")}
    </span>
  );
};

export function AgentWorkLog() {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<"all" | "today" | "week" | "month">("all");

  const totalAgentTime = userWorkData.reduce((sum, u) => sum + u.totalTimeWorked, 0);
  const totalTasks = userWorkData.reduce((sum, u) => sum + u.totalTasks, 0);
  const totalCompleted = userWorkData.reduce((sum, u) => sum + u.completedTasks, 0);

  const filteredData = selectedUser
    ? userWorkData.filter((u) => u.user.id === selectedUser)
    : userWorkData;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="doc-card"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Agent Tasks</p>
              <p className="text-2xl font-bold font-mono text-foreground">{totalTasks}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="doc-card"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-success/10">
              <Clock className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Time Worked</p>
              <p className="text-2xl font-bold font-mono text-foreground">{formatDuration(totalAgentTime)}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="doc-card"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-success/10">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed Tasks</p>
              <p className="text-2xl font-bold font-mono text-foreground">{totalCompleted}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="doc-card"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Success Rate</p>
              <p className="text-2xl font-bold font-mono text-foreground">
                {((totalCompleted / totalTasks) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filter by user:</span>
        </div>
        <select
          value={selectedUser || "all"}
          onChange={(e) => setSelectedUser(e.target.value === "all" ? null : e.target.value)}
          className="px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="all">All Users</option>
          {sampleUsers.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2 ml-4">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Time period:</span>
        </div>
        <div className="flex gap-1">
          {["all", "today", "week", "month"].map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter as typeof timeFilter)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
                timeFilter === filter
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              {filter === "all" ? "All Time" : filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* User Work Cards */}
      <div className="space-y-4">
        {filteredData.map((userData, index) => (
          <motion.div
            key={userData.user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="doc-card overflow-hidden"
          >
            {/* User Header */}
            <button
              onClick={() => setExpandedUser(expandedUser === userData.user.id ? null : userData.user.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">{userData.user.avatar}</span>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-foreground">{userData.user.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {userData.user.role} • {userData.user.department}
                  </p>
                </div>
                <span className="px-2 py-1 text-xs font-medium rounded bg-secondary text-muted-foreground">
                  {userData.user.clearanceLevel}
                </span>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Tasks Completed</p>
                  <p className="text-lg font-bold font-mono text-success">
                    {userData.completedTasks}/{userData.totalTasks}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Agent Time</p>
                  <p className="text-lg font-bold font-mono text-primary">
                    {formatDuration(userData.totalTimeWorked)}
                  </p>
                </div>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 text-muted-foreground transition-transform",
                    expandedUser === userData.user.id && "rotate-180"
                  )}
                />
              </div>
            </button>

            {/* Expanded Task List */}
            {expandedUser === userData.user.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-border"
              >
                <div className="p-4 space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">
                    Agent Work History
                  </h4>
                  {userData.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Bot className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">{task.taskName}</p>
                            <StatusBadge status={task.status} />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {task.agentName} • {task.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-right">
                        <div>
                          <p className="text-sm text-muted-foreground">Documents</p>
                          <p className="font-mono text-foreground">{task.documentsProcessed}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Duration</p>
                          <p className="font-mono text-primary">{formatDuration(task.duration)}</p>
                        </div>
                        <div className="min-w-[80px]">
                          <p className="text-sm text-muted-foreground">When</p>
                          <p className="text-xs text-foreground">{formatRelativeTime(task.timestamp)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
