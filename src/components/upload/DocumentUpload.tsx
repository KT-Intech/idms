import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Upload as UploadIcon, 
  FileText, 
  X, 
  CheckCircle, 
  AlertTriangle,
  Bot,
  Tag,
  Shield,
  Folder
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  status: "uploading" | "processing" | "classified" | "error";
  classification?: string;
  category?: string;
  confidence?: number;
  tags?: string[];
}

const sampleFiles: UploadedFile[] = [
  {
    id: "1",
    name: "INS_Kalvari_Technical_Specs.pdf",
    size: "4.2 MB",
    status: "classified",
    classification: "SECRET",
    category: "Technical Standards",
    confidence: 96,
    tags: ["Submarine", "Scorpene-class", "Naval", "DRDO"]
  },
  {
    id: "2",
    name: "Arjun_MK2_Maintenance_Manual.docx",
    size: "12.8 MB",
    status: "processing",
  },
];

export function DocumentUpload() {
  const [files, setFiles] = useState<UploadedFile[]>(sampleFiles);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Handle file upload
  };

  const removeFile = (id: string) => {
    setFiles(files.filter(f => f.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Upload Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer",
          isDragging 
            ? "border-primary bg-primary/5" 
            : "border-border hover:border-primary/50 hover:bg-secondary/30"
        )}
      >
        <div className="flex flex-col items-center gap-4">
          <div className={cn(
            "p-4 rounded-full transition-colors",
            isDragging ? "bg-primary/20" : "bg-secondary"
          )}>
            <UploadIcon className={cn(
              "w-8 h-8 transition-colors",
              isDragging ? "text-primary" : "text-muted-foreground"
            )} />
          </div>
          <div>
            <p className="text-lg font-medium text-foreground">
              Drop documents here or click to upload
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              PDF, DOCX, XLSX, Images • Max 100MB per file
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Bot className="w-4 h-4 text-primary" />
            <span>AI agents will automatically classify and extract metadata</span>
          </div>
        </div>
      </div>

      {/* Processing Queue */}
      {files.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Processing Queue</h3>
          
          {files.map((file, index) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="doc-card"
            >
              <div className="flex items-start gap-4">
                {/* File Icon */}
                <div className="p-3 rounded-lg bg-primary/10">
                  <FileText className="w-6 h-6 text-primary" />
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-foreground">{file.name}</p>
                      <p className="text-sm text-muted-foreground">{file.size}</p>
                    </div>
                    <button 
                      onClick={() => removeFile(file.id)}
                      className="p-1 rounded hover:bg-secondary transition-colors"
                    >
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>

                  {/* Status */}
                  {file.status === "processing" && (
                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full status-processing" />
                        <span className="text-sm text-warning">AI Classification in progress...</span>
                      </div>
                      <div className="progress-tactical">
                        <motion.div
                          initial={{ width: "0%" }}
                          animate={{ width: "65%" }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="progress-tactical-fill"
                        />
                      </div>
                    </div>
                  )}

                  {file.status === "classified" && (
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span className="text-sm text-success">Classification Complete</span>
                        <span className="text-xs text-muted-foreground">({file.confidence}% confidence)</span>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        {/* Classification */}
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Classification</p>
                            <span className={cn(
                              "px-2 py-0.5 rounded text-xs font-medium",
                              file.classification === "SECRET" && "badge-confidential",
                              file.classification === "TOP SECRET" && "badge-classified"
                            )}>
                              {file.classification}
                            </span>
                          </div>
                        </div>

                        {/* Category */}
                        <div className="flex items-center gap-2">
                          <Folder className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Category</p>
                            <p className="text-sm text-foreground">{file.category}</p>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Auto-Tags</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {file.tags?.slice(0, 2).map((tag) => (
                                <span key={tag} className="px-1.5 py-0.5 text-xs bg-secondary rounded">
                                  {tag}
                                </span>
                              ))}
                              {file.tags && file.tags.length > 2 && (
                                <span className="px-1.5 py-0.5 text-xs bg-secondary rounded text-muted-foreground">
                                  +{file.tags.length - 2}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
