import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, Check, CheckCircle2, Clock3, FileText, GitBranch, MessageSquareText, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ApprovalState = "In review" | "Awaiting review" | "Changes requested" | "Approved";
type StageState = "approved" | "current" | "queued" | "changes";

interface ApprovalStage {
  name: string;
  approver: string;
  role: string;
  state: StageState;
  date?: string;
}

interface ApprovalRequest {
  id: string;
  title: string;
  category: string;
  project: string;
  owner: string;
  submitted: string;
  state: ApprovalState;
  stages: ApprovalStage[];
}

const initialRequests: ApprovalRequest[] = [
  {
    id: "APR-2026-0184",
    title: "Hydraulic pump assembly — inspection plan",
    category: "Quality records",
    project: "Hydraulic Power Unit HPU-4",
    owner: "Maya Patel",
    submitted: "18 Mar 2026",
    state: "In review",
    stages: [
      { name: "Prepared", approver: "Maya Patel", role: "Quality Engineer", state: "approved", date: "18 Mar" },
      { name: "Engineering review", approver: "Daniel Cho", role: "Engineering Manager", state: "approved", date: "18 Mar" },
      { name: "Quality approval", approver: "Priya Nair", role: "Quality Lead", state: "current" },
      { name: "Document control", approver: "Elena Rossi", role: "Document Controller", state: "queued" },
    ],
  },
  {
    id: "APR-2026-0183",
    title: "Field service bulletin — seal replacement",
    category: "Service documentation",
    project: "After-sales service program",
    owner: "Jordan Lee",
    submitted: "17 Mar 2026",
    state: "Awaiting review",
    stages: [
      { name: "Prepared", approver: "Jordan Lee", role: "Service Engineer", state: "approved", date: "17 Mar" },
      { name: "Engineering review", approver: "Daniel Cho", role: "Engineering Manager", state: "current" },
      { name: "Quality approval", approver: "Priya Nair", role: "Quality Lead", state: "queued" },
      { name: "Document control", approver: "Elena Rossi", role: "Document Controller", state: "queued" },
    ],
  },
  {
    id: "APR-2026-0181",
    title: "Supplier deviation — bearing housing lot 64",
    category: "Supplier quality",
    project: "Drive train modernization",
    owner: "Alex Morgan",
    submitted: "16 Mar 2026",
    state: "Changes requested",
    stages: [
      { name: "Prepared", approver: "Alex Morgan", role: "Supplier Quality Engineer", state: "approved", date: "16 Mar" },
      { name: "Engineering review", approver: "Daniel Cho", role: "Engineering Manager", state: "changes" },
      { name: "Quality approval", approver: "Priya Nair", role: "Quality Lead", state: "queued" },
      { name: "Document control", approver: "Elena Rossi", role: "Document Controller", state: "queued" },
    ],
  },
  {
    id: "APR-2026-0179",
    title: "CNC-12 preventive maintenance procedure",
    category: "Operations & maintenance",
    project: "Plant 2 equipment care",
    owner: "Sam Rivera",
    submitted: "14 Mar 2026",
    state: "Approved",
    stages: [
      { name: "Prepared", approver: "Sam Rivera", role: "Maintenance Planner", state: "approved", date: "14 Mar" },
      { name: "Engineering review", approver: "Daniel Cho", role: "Engineering Manager", state: "approved", date: "15 Mar" },
      { name: "Quality approval", approver: "Priya Nair", role: "Quality Lead", state: "approved", date: "15 Mar" },
      { name: "Document control", approver: "Elena Rossi", role: "Document Controller", state: "approved", date: "16 Mar" },
    ],
  },
];

const stateStyles: Record<ApprovalState, string> = {
  "In review": "border-primary/30 bg-primary/10 text-primary",
  "Awaiting review": "border-warning/30 bg-warning/10 text-warning",
  "Changes requested": "border-destructive/30 bg-destructive/10 text-destructive",
  Approved: "border-success/30 bg-success/10 text-success",
};

const stageIcon = (state: StageState) => {
  if (state === "approved") return CheckCircle2;
  if (state === "changes") return AlertCircle;
  if (state === "current") return Clock3;
  return GitBranch;
};

export function ApprovalWorkflow() {
  const [requests, setRequests] = useState(initialRequests);
  const [selectedId, setSelectedId] = useState(initialRequests[0]?.id ?? "");
  const [filter, setFilter] = useState<"All" | ApprovalState>("All");
  const selectedRequest = requests.find((request) => request.id === selectedId) ?? requests[0];
  const pendingCount = useMemo(() => requests.filter((request) => request.state !== "Approved").length, [requests]);
  const visibleRequests = filter === "All" ? requests : requests.filter((request) => request.state === filter);

  const updateCurrentStage = (action: "approve" | "changes") => {
    if (!selectedRequest) return;
    setRequests((current) => current.map((request) => {
      if (request.id !== selectedRequest.id) return request;
      const currentIndex = request.stages.findIndex((stage) => stage.state === "current");
      if (currentIndex < 0) return request;
      const stages = request.stages.map((stage) => ({ ...stage }));
      if (action === "changes") {
        stages[currentIndex] = { ...stages[currentIndex], state: "changes" };
        return { ...request, stages, state: "Changes requested" };
      }
      stages[currentIndex] = { ...stages[currentIndex], state: "approved", date: "Today" };
      const nextIndex = stages.findIndex((stage) => stage.state === "queued");
      if (nextIndex >= 0) {
        stages[nextIndex] = { ...stages[nextIndex], state: "current" };
        return { ...request, stages, state: "In review" };
      }
      return { ...request, stages, state: "Approved" };
    }));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="doc-card flex items-center gap-3">
          <div className="rounded-md bg-warning/10 p-3 text-warning"><Clock3 className="h-5 w-5" /></div>
          <div><p className="text-sm text-muted-foreground">Open approvals</p><p className="font-mono text-2xl font-semibold text-foreground">{pendingCount}</p></div>
        </div>
        <div className="doc-card flex items-center gap-3">
          <div className="rounded-md bg-primary/10 p-3 text-primary"><GitBranch className="h-5 w-5" /></div>
          <div><p className="text-sm text-muted-foreground">Approval levels</p><p className="font-mono text-2xl font-semibold text-foreground">4</p></div>
        </div>
        <div className="doc-card flex items-center gap-3">
          <div className="rounded-md bg-success/10 p-3 text-success"><CheckCircle2 className="h-5 w-5" /></div>
          <div><p className="text-sm text-muted-foreground">Approved this month</p><p className="font-mono text-2xl font-semibold text-foreground">18</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)]">
        <section className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-foreground">Document approvals</h2>
            <div className="flex flex-wrap gap-1">
              {(["All", "In review", "Awaiting review", "Changes requested", "Approved"] as const).map((state) => (
                <Button key={state} size="sm" variant={filter === state ? "secondary" : "ghost"} onClick={() => setFilter(state)}>
                  {state}
                </Button>
              ))}
            </div>
          </div>
          <div className="divide-y divide-border border-y border-border">
            {visibleRequests.map((request) => {
              const completed = request.stages.filter((stage) => stage.state === "approved").length;
              return (
                <button
                  key={request.id}
                  type="button"
                  onClick={() => setSelectedId(request.id)}
                  className={cn("w-full py-4 text-left transition-colors hover:bg-secondary/40", selectedId === request.id && "bg-secondary/30")}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <FileText className="mt-1 h-4 w-4 shrink-0 text-primary" />
                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground">{request.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{request.id} · {request.project}</p>
                        <p className="mt-2 text-xs text-muted-foreground">{completed} of {request.stages.length} levels complete</p>
                      </div>
                    </div>
                    <span className={cn("shrink-0 rounded border px-2 py-1 text-xs", stateStyles[request.state])}>{request.state}</span>
                  </div>
                  <div className="ml-7 mt-3 flex gap-1" aria-label={`${completed} of ${request.stages.length} stages completed`}>
                    {request.stages.map((stage, index) => <span key={`${request.id}-${stage.name}`} className={cn("h-1 flex-1 rounded-full", stage.state === "approved" ? "bg-success" : stage.state === "changes" ? "bg-destructive" : stage.state === "current" ? "bg-primary" : "bg-muted")} />)}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {selectedRequest && (
          <section className="doc-card h-fit">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4">
              <div className="min-w-0">
                <p className="font-mono text-xs text-muted-foreground">{selectedRequest.id}</p>
                <h2 className="mt-1 text-lg font-semibold text-foreground">{selectedRequest.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{selectedRequest.category} · {selectedRequest.project}</p>
              </div>
              <span className={cn("rounded border px-2 py-1 text-xs", stateStyles[selectedRequest.state])}>{selectedRequest.state}</span>
            </div>

            <div className="py-5">
              <p className="mb-4 text-sm font-medium text-foreground">Approval hierarchy</p>
              <ol className="space-y-0">
                {selectedRequest.stages.map((stage, index) => {
                  const Icon = stageIcon(stage.state);
                  return (
                    <li key={`${selectedRequest.id}-${stage.name}`} className="relative flex gap-3 pb-5 last:pb-0">
                      {index < selectedRequest.stages.length - 1 && <span className="absolute left-[15px] top-8 h-[calc(100%-16px)] w-px bg-border" />}
                      <span className={cn("z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border", stage.state === "approved" ? "border-success/30 bg-success/10 text-success" : stage.state === "current" ? "border-primary/30 bg-primary/10 text-primary" : stage.state === "changes" ? "border-destructive/30 bg-destructive/10 text-destructive" : "border-border bg-secondary text-muted-foreground")}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1 pt-0.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-sm font-medium text-foreground">{stage.name}</p>
                          <span className="text-xs capitalize text-muted-foreground">{stage.state === "current" ? "Awaiting action" : stage.state === "queued" ? "Up next" : stage.state === "changes" ? "Changes requested" : stage.date}</span>
                        </div>
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground"><UserRound className="h-3.5 w-3.5" />{stage.approver} · {stage.role}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>

            <div className="flex items-center gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
              <MessageSquareText className="h-4 w-4" />
              Submitted by {selectedRequest.owner} · {selectedRequest.submitted}
            </div>
            {selectedRequest.stages.some((stage) => stage.state === "current") && (
              <div className="mt-4 flex flex-wrap gap-2">
                <Button onClick={() => updateCurrentStage("approve")}><Check className="h-4 w-4" />Approve current level</Button>
                <Button variant="outline" onClick={() => updateCurrentStage("changes")}><AlertCircle className="h-4 w-4" />Request changes</Button>
              </div>
            )}
          </section>
        )}
      </div>
    </motion.div>
  );
}