import { useState } from "react";
import { motion } from "framer-motion";
import { 
  FileText, 
  Grid, 
  List, 
  Filter, 
  SortAsc, 
  Eye, 
  Download, 
  MoreVertical,
  Folder,
  ChevronRight,
  Search as SearchIcon,
  Tag
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Document {
  id: string;
  name: string;
  category: string;
  classification: "TOP SECRET" | "SECRET" | "CONFIDENTIAL" | "RESTRICTED" | "UNCLASSIFIED";
  uploadedBy: string;
  date: string;
  size: string;
  tags: string[];
}

const documents: Document[] = [
  {
    id: "DOC-2026-0847",
    name: "MIL-STD-1553B Interface Specification",
    category: "Technical Standards",
    classification: "SECRET",
    uploadedBy: "Capt. Mehta",
    date: "12 Jan 2026",
    size: "8.4 MB",
    tags: ["Avionics", "Data Bus", "Standard"]
  },
  {
    id: "DOC-2026-0846",
    name: "HAL-DRDO Joint Development Agreement",
    category: "Contracts",
    classification: "CONFIDENTIAL",
    uploadedBy: "Col. Sharma",
    date: "12 Jan 2026",
    size: "2.1 MB",
    tags: ["HAL", "DRDO", "Partnership"]
  },
  {
    id: "DOC-2026-0845",
    name: "LCA Tejas Mark-II Engineering Drawings",
    category: "Engineering",
    classification: "TOP SECRET",
    uploadedBy: "Dr. Reddy",
    date: "11 Jan 2026",
    size: "156.3 MB",
    tags: ["Tejas", "Aircraft", "Design"]
  },
  {
    id: "DOC-2026-0844",
    name: "BrahMos-II Quality Certification Report",
    category: "Quality Records",
    classification: "SECRET",
    uploadedBy: "Maj. Singh",
    date: "11 Jan 2026",
    size: "12.7 MB",
    tags: ["BrahMos", "Missile", "Quality"]
  },
  {
    id: "DOC-2026-0843",
    name: "INS Vikrant Maintenance Schedule",
    category: "Operations",
    classification: "RESTRICTED",
    uploadedBy: "Cmdr. Nair",
    date: "10 Jan 2026",
    size: "4.5 MB",
    tags: ["Aircraft Carrier", "Navy", "Maintenance"]
  },
  {
    id: "DOC-2026-0842",
    name: "Arjun MK-2 Tank Technical Manual",
    category: "Technical Standards",
    classification: "SECRET",
    uploadedBy: "Lt. Col. Verma",
    date: "10 Jan 2026",
    size: "89.2 MB",
    tags: ["Tank", "Army", "Technical"]
  },
  {
    id: "DOC-2026-0841",
    name: "DRDO Budget Allocation FY 2026-27",
    category: "Financial",
    classification: "CONFIDENTIAL",
    uploadedBy: "Director Finance",
    date: "09 Jan 2026",
    size: "1.8 MB",
    tags: ["Budget", "Financial", "DRDO"]
  },
  {
    id: "DOC-2026-0840",
    name: "Akash-NG Missile Test Results",
    category: "Test Reports",
    classification: "TOP SECRET",
    uploadedBy: "Dr. Pillai",
    date: "09 Jan 2026",
    size: "45.6 MB",
    tags: ["Akash", "Missile", "Testing"]
  },
];

const classificationStyles = {
  "TOP SECRET": "badge-classified",
  "SECRET": "badge-confidential",
  "CONFIDENTIAL": "bg-warning/10 text-warning border border-warning/20",
  "RESTRICTED": "badge-restricted",
  "UNCLASSIFIED": "badge-unclassified",
};

const categories = [
  { name: "All Documents", count: 2847 },
  { name: "Technical Standards", count: 389 },
  { name: "Engineering", count: 847 },
  { name: "Contracts", count: 234 },
  { name: "Quality Records", count: 456 },
  { name: "Operations", count: 521 },
  { name: "Financial", count: 198 },
  { name: "Test Reports", count: 202 },
];

export function DocumentExplorer() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [activeCategory, setActiveCategory] = useState("All Documents");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex h-full gap-6">
      {/* Sidebar */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-64 flex-shrink-0"
      >
        <div className="doc-card h-full">
          <h3 className="font-semibold text-foreground mb-4">Categories</h3>
          <div className="space-y-1">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                  activeCategory === cat.name
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <div className="flex items-center gap-2">
                  <Folder className="w-4 h-4" />
                  <span>{cat.name}</span>
                </div>
                <span className="font-mono text-xs">{cat.count}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-4"
        >
          {/* Search */}
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-card border border-border focus:border-primary focus:outline-none transition-colors text-sm"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-sm">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-sm">
              <SortAsc className="w-4 h-4" />
              <span>Sort</span>
            </button>
            <div className="flex items-center border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2 transition-colors",
                  viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-card hover:bg-secondary"
                )}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 transition-colors",
                  viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-card hover:bg-secondary"
                )}
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <span>Documents</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground">{activeCategory}</span>
        </div>

        {/* Documents List */}
        <div className="flex-1 overflow-y-auto">
          {viewMode === "list" ? (
            <div className="doc-card">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-muted-foreground border-b border-border">
                    <th className="pb-3 font-medium">Document</th>
                    <th className="pb-3 font-medium">Classification</th>
                    <th className="pb-3 font-medium">Tags</th>
                    <th className="pb-3 font-medium">Size</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {documents.map((doc, index) => (
                    <motion.tr
                      key={doc.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.05 * index }}
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
                        <span className={cn(
                          "px-2 py-1 rounded text-xs font-medium",
                          classificationStyles[doc.classification]
                        )}>
                          {doc.classification}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex flex-wrap gap-1">
                          {doc.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="px-1.5 py-0.5 text-xs bg-secondary rounded text-muted-foreground">
                              {tag}
                            </span>
                          ))}
                          {doc.tags.length > 2 && (
                            <span className="px-1.5 py-0.5 text-xs bg-secondary rounded text-muted-foreground">
                              +{doc.tags.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="text-sm text-muted-foreground font-mono">{doc.size}</span>
                      </td>
                      <td className="py-3">
                        <span className="text-sm text-muted-foreground">{doc.date}</span>
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
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {documents.map((doc, index) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 * index }}
                  className="doc-card group cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <span className={cn(
                      "px-2 py-1 rounded text-xs font-medium",
                      classificationStyles[doc.classification]
                    )}>
                      {doc.classification}
                    </span>
                  </div>
                  <h4 className="font-medium text-foreground text-sm line-clamp-2 mb-1">{doc.name}</h4>
                  <p className="text-xs text-muted-foreground font-mono mb-3">{doc.id}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {doc.tags.map((tag) => (
                      <span key={tag} className="px-1.5 py-0.5 text-xs bg-secondary rounded text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{doc.date}</span>
                    <span className="font-mono">{doc.size}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
