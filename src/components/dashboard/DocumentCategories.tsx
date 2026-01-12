import { motion } from "framer-motion";
import { FolderOpen, FileText, Wrench, Scale, ClipboardCheck, Cog } from "lucide-react";

interface Category {
  name: string;
  count: number;
  icon: typeof FolderOpen;
  color: string;
}

const categories: Category[] = [
  { name: "Engineering Drawings", count: 847, icon: Wrench, color: "text-primary" },
  { name: "Contracts & Agreements", count: 234, icon: Scale, color: "text-warning" },
  { name: "Quality Certifications", count: 456, icon: ClipboardCheck, color: "text-success" },
  { name: "Technical Standards", count: 389, icon: FileText, color: "text-classified" },
  { name: "Operations & Maintenance", count: 521, icon: Cog, color: "text-accent" },
  { name: "Other Documents", count: 400, icon: FolderOpen, color: "text-muted-foreground" },
];

export function DocumentCategories() {
  const total = categories.reduce((sum, cat) => sum + cat.count, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="doc-card"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Document Categories</h3>
        <span className="text-sm text-muted-foreground font-mono">{total.toLocaleString()} total</span>
      </div>

      <div className="space-y-3">
        {categories.map((category, index) => {
          const Icon = category.icon;
          const percentage = (category.count / total) * 100;

          return (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="group cursor-pointer"
            >
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                <div className="p-2 rounded-lg bg-secondary">
                  <Icon className={`w-4 h-4 ${category.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground truncate">{category.name}</span>
                    <span className="text-sm font-mono text-muted-foreground">{category.count}</span>
                  </div>
                  <div className="mt-1 h-1 rounded-full bg-secondary overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 0.3 + 0.1 * index, duration: 0.6 }}
                      className="h-full rounded-full bg-primary/50"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
