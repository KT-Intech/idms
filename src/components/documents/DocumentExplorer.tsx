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
  Shield,
  Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";

type ViewMode = "category" | "project" | "classification";

interface Document {
  id: string;
  name: string;
  category: string;
  classification: "TOP SECRET" | "SECRET" | "CONFIDENTIAL" | "RESTRICTED" | "UNCLASSIFIED";
  uploadedBy: string;
  date: string;
  size: string;
  tags: string[];
  project: string;
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
    tags: ["Avionics", "Data Bus", "Standard"],
    project: "LCA Tejas Program"
  },
  {
    id: "DOC-2026-0846",
    name: "HAL-DRDO Joint Development Agreement",
    category: "Contracts",
    classification: "CONFIDENTIAL",
    uploadedBy: "Col. Sharma",
    date: "12 Jan 2026",
    size: "2.1 MB",
    tags: ["HAL", "DRDO", "Partnership"],
    project: "Strategic Partnerships"
  },
  {
    id: "DOC-2026-0845",
    name: "LCA Tejas Mark-II Engineering Drawings",
    category: "Engineering",
    classification: "TOP SECRET",
    uploadedBy: "Dr. Reddy",
    date: "11 Jan 2026",
    size: "156.3 MB",
    tags: ["Tejas", "Aircraft", "Design"],
    project: "LCA Tejas Program"
  },
  {
    id: "DOC-2026-0844",
    name: "BrahMos-II Quality Certification Report",
    category: "Quality Records",
    classification: "SECRET",
    uploadedBy: "Maj. Singh",
    date: "11 Jan 2026",
    size: "12.7 MB",
    tags: ["BrahMos", "Missile", "Quality"],
    project: "BrahMos Missile System"
  },
  {
    id: "DOC-2026-0843",
    name: "INS Vikrant Maintenance Schedule",
    category: "Operations",
    classification: "RESTRICTED",
    uploadedBy: "Cmdr. Nair",
    date: "10 Jan 2026",
    size: "4.5 MB",
    tags: ["Aircraft Carrier", "Navy", "Maintenance"],
    project: "INS Vikrant Operations"
  },
  {
    id: "DOC-2026-0842",
    name: "Arjun MK-2 Tank Technical Manual",
    category: "Technical Standards",
    classification: "SECRET",
    uploadedBy: "Lt. Col. Verma",
    date: "10 Jan 2026",
    size: "89.2 MB",
    tags: ["Tank", "Army", "Technical"],
    project: "Arjun MBT Program"
  },
  {
    id: "DOC-2026-0841",
    name: "DRDO Budget Allocation FY 2026-27",
    category: "Financial",
    classification: "CONFIDENTIAL",
    uploadedBy: "Director Finance",
    date: "09 Jan 2026",
    size: "1.8 MB",
    tags: ["Budget", "Financial", "DRDO"],
    project: "Strategic Partnerships"
  },
  {
    id: "DOC-2026-0840",
    name: "Akash-NG Missile Test Results",
    category: "Test Reports",
    classification: "TOP SECRET",
    uploadedBy: "Dr. Pillai",
    date: "09 Jan 2026",
    size: "45.6 MB",
    tags: ["Akash", "Missile", "Testing"],
    project: "Akash Air Defence"
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

const projects = [
  { name: "All Projects", count: 2847 },
  { name: "LCA Tejas Program", count: 534 },
  { name: "BrahMos Missile System", count: 423 },
  { name: "INS Vikrant Operations", count: 312 },
  { name: "Arjun MBT Program", count: 287 },
  { name: "Akash Air Defence", count: 256 },
  { name: "Strategic Partnerships", count: 198 },
  { name: "AMCA Stealth Fighter", count: 412 },
  { name: "Naval Submarine Program", count: 345 },
];

const classifications = [
  { name: "All Classifications", count: 2847 },
  { name: "TOP SECRET", count: 234 },
  { name: "SECRET", count: 1245 },
  { name: "CONFIDENTIAL", count: 856 },
  { name: "RESTRICTED", count: 412 },
  { name: "UNCLASSIFIED", count: 100 },
];

const viewModes: { id: ViewMode; label: string; icon: typeof Folder }[] = [
  { id: "category", label: "By Category", icon: Folder },
  { id: "project", label: "By Project", icon: Briefcase },
  { id: "classification", label: "By Classification", icon: Shield },
];

export function DocumentExplorer() {
  const [displayMode, setDisplayMode] = useState<"grid" | "list">("list");
  const [viewMode, setViewMode] = useState<ViewMode>("category");
  const [activeFilter, setActiveFilter] = useState("All Documents");
  const [searchQuery, setSearchQuery] = useState("");

  const getSidebarItems = () => {
    switch (viewMode) {
      case "category":
        return categories;
      case "project":
        return projects;
      case "classification":
        return classifications;
      default:
        return categories;
    }
  };

  const getFilteredDocuments = () => {
    let filtered = documents;
    
    if (viewMode === "category" && activeFilter !== "All Documents") {
      filtered = filtered.filter(doc => doc.category === activeFilter);
    } else if (viewMode === "project" && activeFilter !== "All Projects") {
      filtered = filtered.filter(doc => doc.project === activeFilter);
    } else if (viewMode === "classification" && activeFilter !== "All Classifications") {
      filtered = filtered.filter(doc => doc.classification === activeFilter);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(doc => 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  };

  const sidebarItems = getSidebarItems();
  const filteredDocuments = getFilteredDocuments();

  return (
    <div className="flex h-full gap-6">
      {/* Sidebar */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-64 flex-shrink-0 flex flex-col gap-4"
      >
        {/* View Mode Toggle */}
        <div className="doc-card">
          <h3 className="font-semibold text-foreground mb-3 text-sm">View By</h3>
          <div className="space-y-1">
            {viewModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => {
                  setViewMode(mode.id);
                  setActiveFilter(
                    mode.id === "category" ? "All Documents" :
                    mode.id === "project" ? "All Projects" : "All Classifications"
                  );
                }}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                  viewMode === mode.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <mode.icon className="w-4 h-4" />
                <span>{mode.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Filter Items */}
        <div className="doc-card flex-1 overflow-hidden flex flex-col">
          <h3 className="font-semibold text-foreground mb-3 text-sm capitalize">
            {viewMode === "category" ? "Categories" : viewMode === "project" ? "Projects" : "Classifications"}
          </h3>
          <div className="space-y-1 overflow-y-auto flex-1">
            {sidebarItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveFilter(item.name)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                  activeFilter === item.name
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <div className="flex items-center gap-2">
                  {viewMode === "category" && <Folder className="w-4 h-4" />}
                  {viewMode === "project" && <Briefcase className="w-4 h-4" />}
                  {viewMode === "classification" && <Shield className="w-4 h-4" />}
                  <span className="truncate">{item.name}</span>
                </div>
                <span className="font-mono text-xs">{item.count}</span>
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
                onClick={() => setDisplayMode("list")}
                className={cn(
                  "p-2 transition-colors",
                  displayMode === "list" ? "bg-primary text-primary-foreground" : "bg-card hover:bg-secondary"
                )}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDisplayMode("grid")}
                className={cn(
                  "p-2 transition-colors",
                  displayMode === "grid" ? "bg-primary text-primary-foreground" : "bg-card hover:bg-secondary"
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
          <span className="text-muted-foreground capitalize">{viewMode}</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground">{activeFilter}</span>
        </div>

        {/* Documents List */}
        <div className="flex-1 overflow-y-auto">
          {filteredDocuments.length === 0 ? (
            <div className="doc-card flex items-center justify-center h-48">
              <p className="text-muted-foreground">No documents found matching your criteria.</p>
            </div>
          ) : displayMode === "list" ? (
            <div className="doc-card">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-muted-foreground border-b border-border">
                    <th className="pb-3 font-medium">Document</th>
                    <th className="pb-3 font-medium">Classification</th>
                    <th className="pb-3 font-medium">Project</th>
                    <th className="pb-3 font-medium">Size</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredDocuments.map((doc, index) => (
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
                        <span className="text-sm text-muted-foreground">{doc.project}</span>
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
              {filteredDocuments.map((doc, index) => (
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
                  <p className="text-xs text-muted-foreground font-mono mb-2">{doc.id}</p>
                  <p className="text-xs text-primary/80 mb-3 flex items-center gap-1">
                    <Briefcase className="w-3 h-3" />
                    {doc.project}
                  </p>
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
