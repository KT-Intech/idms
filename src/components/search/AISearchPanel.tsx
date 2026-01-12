import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Send, 
  FileText, 
  Bot, 
  User, 
  Sparkles,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Copy
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  timestamp: Date;
}

interface Citation {
  id: string;
  title: string;
  docId: string;
  relevance: number;
}

const sampleMessages: Message[] = [
  {
    id: "1",
    role: "user",
    content: "What are the maintenance requirements for the BrahMos-II missile system?",
    timestamp: new Date(Date.now() - 60000),
  },
  {
    id: "2",
    role: "assistant",
    content: "Based on the BrahMos-II Technical Manual (DOC-2025-4521) and Quality Certification Report (DOC-2026-0844), the maintenance requirements include:\n\n**Scheduled Maintenance:**\n• Pre-flight checks every mission cycle\n• Monthly diagnostic system verification\n• Quarterly propulsion system inspection\n• Annual comprehensive system overhaul\n\n**Critical Components:**\n1. Guidance system calibration (every 500 hours)\n2. Seeker head alignment verification\n3. Fuel system integrity checks\n4. Warhead safety mechanism testing\n\n**Compliance:** All maintenance must follow DRDO-MIL-STD-2045 standards and be logged in the ITAR-compliant maintenance registry.",
    citations: [
      { id: "c1", title: "BrahMos-II Technical Manual", docId: "DOC-2025-4521", relevance: 98 },
      { id: "c2", title: "Quality Certification Report", docId: "DOC-2026-0844", relevance: 94 },
      { id: "c3", title: "DRDO-MIL-STD-2045", docId: "DOC-2024-1893", relevance: 87 },
    ],
    timestamp: new Date(Date.now() - 30000),
  },
];

export function AISearchPanel() {
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm searching through the document repository to find relevant information about your query. This is a demo response that would normally contain AI-generated insights with citations from the defence document database.",
        citations: [
          { id: "c1", title: "Related Document", docId: "DOC-2026-XXXX", relevance: 95 },
        ],
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col h-full bg-card rounded-xl border border-border overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-border bg-secondary/30">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20 animate-glow-pulse">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">AI Document Intelligence</h3>
            <p className="text-xs text-muted-foreground">Ask questions in natural language • Grounded with citations</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={cn("flex gap-3", message.role === "user" && "flex-row-reverse")}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                message.role === "user" ? "bg-primary" : "bg-secondary"
              )}>
                {message.role === "user" ? (
                  <User className="w-4 h-4 text-primary-foreground" />
                ) : (
                  <Bot className="w-4 h-4 text-primary" />
                )}
              </div>
              
              <div className={cn(
                "flex-1 max-w-[80%]",
                message.role === "user" && "flex flex-col items-end"
              )}>
                <div className={cn(
                  "rounded-xl p-4",
                  message.role === "user" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-secondary"
                )}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>

                {/* Citations */}
                {message.citations && message.citations.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <FileText className="w-3 h-3" /> Sources ({message.citations.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {message.citations.map((citation) => (
                        <button
                          key={citation.id}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors text-xs"
                        >
                          <span className="text-foreground">{citation.title}</span>
                          <span className="text-muted-foreground font-mono">{citation.docId}</span>
                          <span className="text-primary">{citation.relevance}%</span>
                          <ExternalLink className="w-3 h-3 text-muted-foreground" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions for assistant messages */}
                {message.role === "assistant" && (
                  <div className="flex items-center gap-2 mt-2">
                    <button className="p-1.5 rounded hover:bg-secondary transition-colors">
                      <ThumbsUp className="w-3 h-3 text-muted-foreground" />
                    </button>
                    <button className="p-1.5 rounded hover:bg-secondary transition-colors">
                      <ThumbsDown className="w-3 h-3 text-muted-foreground" />
                    </button>
                    <button className="p-1.5 rounded hover:bg-secondary transition-colors">
                      <Copy className="w-3 h-3 text-muted-foreground" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="bg-secondary rounded-xl p-4">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-secondary/30">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about documents, policies, or technical specifications..."
            className="w-full pl-12 pr-12 py-3 rounded-xl bg-card border border-border focus:border-primary focus:outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all",
              input.trim() 
                ? "bg-primary text-primary-foreground hover:opacity-90" 
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          AI responses are grounded with RAG to prevent hallucinations
        </p>
      </form>
    </motion.div>
  );
}
