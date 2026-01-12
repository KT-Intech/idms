import { motion } from "framer-motion";
import { Shield, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

interface ComplianceItem {
  name: string;
  status: "compliant" | "warning" | "violation";
  percentage: number;
}

const complianceItems: ComplianceItem[] = [
  { name: "ITAR Compliance", status: "compliant", percentage: 98 },
  { name: "Data Classification", status: "compliant", percentage: 95 },
  { name: "Access Control", status: "warning", percentage: 87 },
  { name: "Retention Policy", status: "compliant", percentage: 92 },
  { name: "Audit Trail", status: "compliant", percentage: 100 },
];

const statusConfig = {
  compliant: { icon: CheckCircle, color: "text-success", bg: "bg-success" },
  warning: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning" },
  violation: { icon: XCircle, color: "text-destructive", bg: "bg-destructive" },
};

export function ComplianceOverview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="doc-card"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-success/10">
          <Shield className="w-5 h-5 text-success" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Compliance Status</h3>
          <p className="text-xs text-muted-foreground">Last audit: 2 hours ago</p>
        </div>
      </div>

      <div className="space-y-4">
        {complianceItems.map((item, index) => {
          const config = statusConfig[item.status];
          const StatusIcon = config.icon;

          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <StatusIcon className={`w-4 h-4 ${config.color}`} />
                  <span className="text-sm text-foreground">{item.name}</span>
                </div>
                <span className={`text-sm font-mono ${config.color}`}>{item.percentage}%</span>
              </div>
              <div className="progress-tactical">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage}%` }}
                  transition={{ delay: 0.2 + 0.1 * index, duration: 0.8 }}
                  className="progress-tactical-fill"
                  style={{
                    background: item.status === "warning" 
                      ? "linear-gradient(135deg, hsl(38 92% 50%) 0%, hsl(25 90% 45%) 100%)"
                      : undefined
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 p-3 rounded-lg bg-success/10 border border-success/20">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-success" />
          <span className="text-sm text-success font-medium">Overall Compliance: 94.4%</span>
        </div>
      </div>
    </motion.div>
  );
}
