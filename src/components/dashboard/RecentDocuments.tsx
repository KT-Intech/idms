import { motion } from "framer-motion";
import { FileText, Eye, Download, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface Document {
  id: string;
  name: string;
  category: string;
  classification: "TOP SECRET" | "SECRET" | "CONFIDENTIAL" | "RESTRICTED" | "UNCLASSIFIED";
  uploadedBy: string;
  date: string;
  status: "processed" | "pending" | "review";
}

const documents: Document[] = [
  {
    id: "DOC-2026-0847",
    name: "MIL-STD-1553B Interface Specification",
    category: "Technical Standards",
    classification: "SECRET",
    uploadedBy: "Capt. Mehta",
    date: "12 Jan 2026",
    status: "processed"
  },
  {
    id: "DOC-2026-0846",
    name: "HAL-DRDO Joint Development Agreement",
    category: "Contracts",
    classification: "CONFIDENTIAL",
    uploadedBy: "Col. Sharma",
    date: "12 Jan 2026",
    status: "review"
  },
  {
    id: "DOC-2026-0845",
    name: "LCA Tejas Mark-II Engineering Drawings",
    category: "Engineering",
    classification: "TOP SECRET",
    uploadedBy: "Dr. Reddy",
    date: "11 Jan 2026",
    status: "processed"
  },
  {
    id: "DOC-2026-0844",
    name: "BrahMos-II Quality Certification Report",
    category: "Quality Records",
    classification: "SECRET",
    uploadedBy: "Maj. Singh",
    date: "11 Jan 2026",
    status: "pending"
  },
  {
    id: "DOC-2026-0843",
    name: "INS Vikrant Maintenance Schedule",
    category: "Operations",
    classification: "RESTRICTED",
    uploadedBy: "Cmdr. Nair",
    date: "10 Jan 2026",
    status: "processed"
  },
];

const classificationStyles = {
  "TOP SECRET": "badge-classified",
  "SECRET": "badge-confidential",
  "CONFIDENTIAL": "bg-warning/10 text-warning border border-warning/20",
  "RESTRICTED": "badge-restricted",
  "UNCLASSIFIED": "badge-unclassified",
};

const statusStyles = {
  processed: "text-success",
  pending: "text-warning",
  review: "text-primary",
};

export function RecentDocuments() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="doc-card col-span-2"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Recent Documents</h3>
        <button className="text-sm text-primary hover:underline">View All</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-muted-foreground border-b border-border">
              <th className="pb-3 font-medium">Document</th>
              <th className="pb-3 font-medium">Category</th>
              <th className="pb-3 font-medium">Classification</th>
              <th className="pb-3 font-medium">Uploaded By</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {documents.map((doc, index) => (
              <motion.tr
                key={doc.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 * index }}
                className="group hover:bg-secondary/30 transition-colors"
              >
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{doc.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{doc.id}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3">
                  <span className="text-sm text-muted-foreground">{doc.category}</span>
                </td>
                <td className="py-3">
                  <span className={cn(
                    "px-2 py-1 rounded text-xs font-medium",
                    classificationStyles[doc.classification]
                  )}>
                    {doc.classification}
                  </span>
                </td>
                <td className="py-3">
                  <div>
                    <p className="text-sm text-foreground">{doc.uploadedBy}</p>
                    <p className="text-xs text-muted-foreground">{doc.date}</p>
                  </div>
                </td>
                <td className="py-3">
                  <span className={cn("text-sm font-medium capitalize", statusStyles[doc.status])}>
                    {doc.status}
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 rounded hover:bg-secondary transition-colors">
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button className="p-1.5 rounded hover:bg-secondary transition-colors">
                      <Download className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button className="p-1.5 rounded hover:bg-secondary transition-colors">
                      <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
