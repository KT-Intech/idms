import { useState } from "react";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  FileText, 
  Search, 
  Upload, 
  Bot, 
  Shield, 
  Settings,
  ChevronLeft,
  ChevronRight,
  ClipboardList
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: typeof LayoutDashboard;
  label: string;
  id: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: FileText, label: "Documents", id: "documents", badge: 2847 },
  { icon: Search, label: "AI Search", id: "search" },
  { icon: Upload, label: "Ingestion", id: "upload" },
  { icon: Bot, label: "Agents", id: "agents", badge: 5 },
  { icon: ClipboardList, label: "Agent Work Log", id: "worklog" },
  { icon: Shield, label: "Compliance", id: "compliance" },
  { icon: Settings, label: "Settings", id: "settings" },
];

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={cn(
        "h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-16 border-b border-sidebar-border flex items-center justify-between px-4">
        {!collapsed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-sidebar-foreground">IDMS</h1>
              <p className="text-xs text-muted-foreground">Defence Portal</p>
            </div>
          </motion.div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center mx-auto">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200",
                isActive 
                  ? "bg-primary/10 text-primary border border-primary/30" 
                  : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <Icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-glow")} />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-xs font-mono bg-secondary rounded-full">
                      {item.badge.toLocaleString()}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Agent Status */}
      {!collapsed && (
        <div className="p-3 border-t border-sidebar-border">
          <div className="p-3 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full status-online" />
              <span className="text-xs font-medium text-sidebar-foreground">Agents Online</span>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i}
                  className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center"
                >
                  <Bot className="w-3 h-3 text-primary" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="h-12 border-t border-sidebar-border flex items-center justify-center text-muted-foreground hover:text-sidebar-foreground transition-colors"
      >
        {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
      </button>
    </motion.aside>
  );
}
