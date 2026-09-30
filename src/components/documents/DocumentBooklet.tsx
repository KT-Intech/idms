import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, BookOpen, Download, FilePlus2, FileText, Layers3, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface SourceDocument {
  id: string;
  name: string;
  category: string;
  project: string;
  date: string;
  tags: string[];
}

interface CreatedBooklet {
  id: string;
  title: string;
  createdAt: string;
  sources: SourceDocument[];
}

const sourceDocuments: SourceDocument[] = [
  { id: "DOC-2026-0847", name: "Hydraulic pump assembly — inspection plan", category: "Quality records", project: "Hydraulic Power Unit HPU-4", date: "18 Mar 2026", tags: ["Inspection", "Hydraulics", "Quality"] },
  { id: "DOC-2026-0846", name: "Field service bulletin — seal replacement", category: "Service documentation", project: "After-sales service program", date: "17 Mar 2026", tags: ["Service", "Seal kit", "Revision B"] },
  { id: "DOC-2026-0845", name: "HPU-4 assembly and installation guide", category: "Work instructions", project: "Hydraulic Power Unit HPU-4", date: "15 Mar 2026", tags: ["Assembly", "Installation"] },
  { id: "DOC-2026-0844", name: "Pump performance test report — batch 2403", category: "Test reports", project: "Hydraulic Power Unit HPU-4", date: "14 Mar 2026", tags: ["Test", "Performance", "Batch 2403"] },
  { id: "DOC-2026-0843", name: "Spare parts catalogue — hydraulic assemblies", category: "Parts catalogues", project: "After-sales service program", date: "12 Mar 2026", tags: ["Spare parts", "Service"] },
  { id: "DOC-2026-0842", name: "Preventive maintenance checklist — CNC-12", category: "Operations & maintenance", project: "Plant 2 equipment care", date: "10 Mar 2026", tags: ["Maintenance", "CNC-12"] },
];

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[character] ?? character));

const buildBookletHtml = (booklet: CreatedBooklet) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>${escapeHtml(booklet.title)}</title>
<style>body{font:16px/1.6 Arial,sans-serif;max-width:820px;margin:48px auto;padding:0 24px;color:#202a31}h1{font-size:30px;border-bottom:2px solid #287d78;padding-bottom:16px}h2{font-size:20px;margin-bottom:4px}.meta{color:#59676e;font-size:13px}.section{page-break-inside:avoid;border-bottom:1px solid #d6dfe0;padding:18px 0}.tag{display:inline-block;margin:4px 6px 0 0;padding:3px 8px;background:#edf3f2;border-radius:4px;font-size:12px}</style></head>
<body><p class="meta">DOCUMENT BOOKLET · ${escapeHtml(booklet.id)}</p><h1>${escapeHtml(booklet.title)}</h1><p class="meta">Created ${escapeHtml(booklet.createdAt)} · ${booklet.sources.length} referenced documents</p>
${booklet.sources.map((source, index) => `<section class="section"><p class="meta">SECTION ${String(index + 1).padStart(2, "0")} · ${escapeHtml(source.id)}</p><h2>${escapeHtml(source.name)}</h2><p>${escapeHtml(source.category)} · ${escapeHtml(source.project)} · ${escapeHtml(source.date)}</p><div>${source.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div></section>`).join("")}
<p class="meta">This booklet references source documents. Source records remain unchanged.</p></body></html>`;

export function DocumentBooklet() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [title, setTitle] = useState("HPU-4 Service & Quality Booklet");
  const [createdBooklet, setCreatedBooklet] = useState<CreatedBooklet | null>(null);
  const selectedDocuments = useMemo(() => selectedIds.map((id) => sourceDocuments.find((document) => document.id === id)).filter((document): document is SourceDocument => Boolean(document)), [selectedIds]);
  const filteredDocuments = sourceDocuments.filter((document) => `${document.name} ${document.id} ${document.project} ${document.category}`.toLowerCase().includes(query.toLowerCase()));

  const toggleDocument = (id: string) => {
    setSelectedIds((current) => current.includes(id) ? current.filter((selectedId) => selectedId !== id) : [...current, id]);
  };

  const moveDocument = (index: number, direction: -1 | 1) => {
    setSelectedIds((current) => {
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= current.length) return current;
      const next = [...current];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  };

  const createBooklet = () => {
    if (selectedDocuments.length < 2 || !title.trim()) return;
    setCreatedBooklet({
      id: `BOOK-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
      title: title.trim(),
      createdAt: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      sources: [...selectedDocuments],
    });
  };

  const downloadBooklet = () => {
    if (!createdBooklet) return;
    const file = new Blob([buildBookletHtml(createdBooklet)], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(file);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${createdBooklet.title.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "")}.html`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)]">
        <section className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div><h2 className="text-lg font-semibold text-foreground">Source documents</h2><p className="text-sm text-muted-foreground">{selectedIds.length} selected</p></div>
            <label className="relative block w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a document" className="command-input w-full py-2 pl-9" />
            </label>
          </div>
          <div className="divide-y divide-border border-y border-border">
            {filteredDocuments.map((document) => (
              <label key={document.id} className="flex cursor-pointer items-start gap-3 py-4 hover:bg-secondary/30">
                <Checkbox checked={selectedIds.includes(document.id)} onCheckedChange={() => toggleDocument(document.id)} className="mt-1" aria-label={`Select ${document.name}`} />
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span className="min-w-0 flex-1">
                  <span className="block font-medium text-foreground">{document.name}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">{document.id} · {document.category}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">{document.project}</span>
                </span>
                <span className="hidden shrink-0 text-xs text-muted-foreground md:inline">{document.date}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="doc-card h-fit">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <div className="rounded-md bg-primary/10 p-3 text-primary"><BookOpen className="h-5 w-5" /></div>
            <div><h2 className="font-semibold text-foreground">Booklet contents</h2><p className="text-xs text-muted-foreground">Arrange the new document</p></div>
            <span className="ml-auto font-mono text-sm text-muted-foreground">{selectedDocuments.length}</span>
          </div>
          <label className="mt-4 block text-sm font-medium text-foreground" htmlFor="booklet-title">Output title</label>
          <input id="booklet-title" value={title} onChange={(event) => setTitle(event.target.value)} className="command-input mt-2 w-full" />
          <ol className="mt-4 divide-y divide-border">
            {selectedDocuments.map((document, index) => (
              <li key={document.id} className="flex items-center gap-2 py-3">
                <span className="w-6 shrink-0 font-mono text-xs text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                <span className="min-w-0 flex-1 truncate text-sm text-foreground">{document.name}</span>
                <Button variant="ghost" size="icon" aria-label={`Move ${document.name} up`} disabled={index === 0} onClick={() => moveDocument(index, -1)}><ArrowUp /></Button>
                <Button variant="ghost" size="icon" aria-label={`Move ${document.name} down`} disabled={index === selectedDocuments.length - 1} onClick={() => moveDocument(index, 1)}><ArrowDown /></Button>
              </li>
            ))}
            {selectedDocuments.length === 0 && <li className="py-8 text-center text-sm text-muted-foreground">No documents selected</li>}
          </ol>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={createBooklet} disabled={selectedDocuments.length < 2 || !title.trim()}><FilePlus2 className="h-4 w-4" />Create new booklet</Button>
            {createdBooklet && <Button variant="outline" onClick={downloadBooklet}><Download className="h-4 w-4" />Download booklet</Button>}
          </div>
        </section>
      </div>

      {createdBooklet && (
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="border-t border-border pt-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Layers3 className="h-5 w-5 text-success" />
              <div><h2 className="font-semibold text-foreground">{createdBooklet.title}</h2><p className="text-xs text-muted-foreground">{createdBooklet.id} · {createdBooklet.sources.length} source documents · Created {createdBooklet.createdAt}</p></div>
            </div>
            <span className="rounded border border-success/30 bg-success/10 px-2 py-1 text-xs text-success">New document</span>
          </div>
        </motion.section>
      )}
    </motion.div>
  );
}