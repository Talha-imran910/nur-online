import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Upload, Trash2, ArrowUp, ArrowDown, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { parseBulkLessons, bulkInsertLessons, createUnit, type Course, type Unit } from "@/lib/db";
import { useQueryClient } from "@tanstack/react-query";

const EXAMPLE = `Introduction to Tajweed - https://www.youtube.com/watch?v=dQw4w9WgXcQ
Surah Al-Baqarah, Ayah 1-5 - https://www.youtube.com/watch?v=abcdefghijk`;

export default function BulkAddLessonsDialog({ course }: { course: Course }) {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [raw, setRaw] = useState("");
  const [unitId, setUnitId] = useState<string>(course.units[0]?.id ?? "__new");
  const [newUnitTitle, setNewUnitTitle] = useState("");
  const [saving, setSaving] = useState(false);

  const { parsed, skipped } = useMemo(() => parseBulkLessons(raw), [raw]);
  const [rows, setRows] = useState<{ title: string; youtubeUrl: string; videoId: string }[]>([]);

  // Keep local `rows` in sync when the raw text changes — but preserve user edits by keying on videoId.
  const syncFromParse = () => setRows(parsed);

  const move = (i: number, dir: -1 | 1) => {
    setRows((r) => {
      const next = [...r];
      const j = i + dir;
      if (j < 0 || j >= next.length) return r;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };
  const remove = (i: number) => setRows((r) => r.filter((_, k) => k !== i));
  const updateTitle = (i: number, v: string) => setRows((r) => r.map((x, k) => (k === i ? { ...x, title: v } : x)));

  const save = async () => {
    if (rows.length === 0) return toast({ title: "Nothing to add", description: "Paste lessons and click Preview first.", variant: "destructive" });
    setSaving(true);
    try {
      let targetUnitId = unitId;
      if (unitId === "__new") {
        const title = newUnitTitle.trim() || "New Unit";
        const { id, error } = await createUnit(course.id, title);
        if (error) throw error;
        targetUnitId = id;
      }
      const { error, count } = await bulkInsertLessons(targetUnitId, rows);
      if (error) throw error;
      toast({ title: "Lessons added ✅", description: `${count} lessons inserted into "${course.title}".` });
      qc.invalidateQueries({ queryKey: ["course", course.id] });
      qc.invalidateQueries({ queryKey: ["courses"] });
      setOpen(false);
      setRaw("");
      setRows([]);
    } catch (e: any) {
      toast({ title: "Failed", description: e.message || String(e), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1 rounded-lg"><Upload className="h-3 w-3" /> Bulk Add Lessons</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="font-serif">Bulk Add Lessons — {course.title}</DialogTitle></DialogHeader>

        <div className="space-y-4 mt-2">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Paste lessons — one per line, format: <code className="text-foreground">Title - https://youtube.com/watch?v=ID</code></label>
            <Textarea
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              placeholder={EXAMPLE}
              className="mt-1.5 min-h-[140px] font-mono text-xs"
            />
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <Button size="sm" variant="outline" onClick={syncFromParse} disabled={parsed.length === 0}>
                Preview {parsed.length > 0 ? `(${parsed.length})` : ""}
              </Button>
              {skipped.length > 0 && (
                <Badge className="bg-gold/15 text-gold text-[10px]">
                  Skipped lines: {skipped.join(", ")}
                </Badge>
              )}
            </div>
          </div>

          {rows.length > 0 && (
            <div className="space-y-2 border-t border-border pt-4">
              <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Preview ({rows.length} lessons)</p>
              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                {rows.map((r, i) => (
                  <div key={`${r.videoId}-${i}`} className="flex items-center gap-2 p-2 rounded-lg border border-border/60 bg-card">
                    <span className="text-[10px] text-muted-foreground w-6 shrink-0 text-center">{i + 1}</span>
                    <Input value={r.title} onChange={(e) => updateTitle(i, e.target.value)} className="h-8 text-sm" />
                    <div className="flex gap-0.5 shrink-0">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => move(i, -1)} disabled={i === 0}><ArrowUp className="h-3.5 w-3.5" /></Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => move(i, 1)} disabled={i === rows.length - 1}><ArrowDown className="h-3.5 w-3.5" /></Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => remove(i)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-border">
                <label className="text-xs font-medium text-muted-foreground">Add to unit</label>
                <select
                  value={unitId}
                  onChange={(e) => setUnitId(e.target.value)}
                  className="mt-1.5 w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
                >
                  {course.units.map((u: Unit) => (
                    <option key={u.id} value={u.id}>{u.title} ({u.lessons.length} existing)</option>
                  ))}
                  <option value="__new">➕ Create new unit…</option>
                </select>
                {unitId === "__new" && (
                  <Input
                    value={newUnitTitle}
                    onChange={(e) => setNewUnitTitle(e.target.value)}
                    placeholder="New unit title (e.g. Tajweed Basics)"
                    className="mt-2 h-9"
                  />
                )}
              </div>

              <Button variant="emerald" className="w-full gap-1.5 mt-3" onClick={save} disabled={saving}>
                <Plus className="h-4 w-4" /> {saving ? "Adding…" : `Add ${rows.length} lessons`}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
