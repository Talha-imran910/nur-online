import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Star, Check, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { fetchAllReviews, approveReview, rejectReview, type Review } from "@/lib/db";

function Stars({ n }: { n: number }) {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`h-3.5 w-3.5 ${i <= n ? "text-gold fill-gold" : "text-muted-foreground/30"}`} />
      ))}
    </div>
  );
}

export default function ReviewsTab({ courseTitleById }: { courseTitleById: Record<string, string> }) {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [tab, setTab] = useState<"pending" | "approved">("pending");

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["admin", "reviews"],
    queryFn: fetchAllReviews,
    staleTime: 30_000,
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin", "reviews"] });
    qc.invalidateQueries({ queryKey: ["reviews"] });
  };

  const approve = useMutation({
    mutationFn: (id: string) => approveReview(id),
    onSuccess: () => { toast({ title: "Approved ✅" }); invalidate(); },
  });
  const reject = useMutation({
    mutationFn: (id: string) => rejectReview(id),
    onSuccess: () => { toast({ title: "Rejected 🗑️" }); invalidate(); },
  });

  const pending = reviews.filter((r) => !r.isApproved);
  const approved = reviews.filter((r) => r.isApproved);
  const list = tab === "pending" ? pending : approved;

  const renderCard = (r: Review) => (
    <Card key={r.id} className="border-border/50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <p className="text-sm font-semibold text-foreground">{r.studentName}</p>
              <Stars n={r.rating} />
              <Badge className={r.isApproved ? "bg-emerald/15 text-emerald-600 text-[10px]" : "bg-gold/15 text-gold text-[10px]"}>
                {r.isApproved ? "Approved" : "Pending"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-1.5">
              Course: {courseTitleById[r.courseId] || r.courseId} · {new Date(r.createdAt).toLocaleDateString()}
            </p>
            {r.comment && <p className="text-sm text-foreground/90 italic">"{r.comment}"</p>}
          </div>
          <div className="flex gap-1.5 shrink-0">
            {!r.isApproved && (
              <Button size="sm" variant="outline" className="gap-1" onClick={() => approve.mutate(r.id)} disabled={approve.isPending}>
                <Check className="h-3.5 w-3.5" /> Approve
              </Button>
            )}
            <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1"
              onClick={() => { if (confirm("Delete this review permanently?")) reject.mutate(r.id); }} disabled={reject.isPending}>
              <Trash2 className="h-3.5 w-3.5" /> {r.isApproved ? "Delete" : "Reject"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-serif text-2xl font-bold text-foreground">Student Reviews</h2>
        <p className="text-sm text-muted-foreground mt-1">Approve reviews before they appear publicly on course pages.</p>
      </div>

      <div className="flex gap-2">
        <Button size="sm" variant={tab === "pending" ? "emerald" : "outline"} onClick={() => setTab("pending")}>
          Pending ({pending.length})
        </Button>
        <Button size="sm" variant={tab === "approved" ? "emerald" : "outline"} onClick={() => setTab("approved")}>
          Approved ({approved.length})
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground py-6 text-center">Loading reviews…</p>
      ) : list.length === 0 ? (
        <Card className="border-border/50"><CardContent className="py-10 text-center text-muted-foreground">
          <p className="font-serif text-lg">{tab === "pending" ? "Nothing pending 🌸" : "No approved reviews yet."}</p>
        </CardContent></Card>
      ) : (
        <div className="grid gap-3">{list.map(renderCard)}</div>
      )}
    </div>
  );
}
