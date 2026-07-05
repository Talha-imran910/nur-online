import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { fetchApprovedReviews, fetchMyReviewForCourse, submitReview, type Review } from "@/lib/db";
import { supabase } from "@/integrations/supabase/client";

function Stars({ value, onChange, size = "h-5 w-5" }: { value: number; onChange?: (n: number) => void; size?: string }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(n)}
          className={`${onChange ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"}`}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
        >
          <Star className={`${size} ${n <= value ? "text-gold fill-gold" : "text-muted-foreground/40"}`} />
        </button>
      ))}
    </div>
  );
}

interface Props {
  courseId: string;
  userId: string | null;
  isEnrolled: boolean;
}

export default function CourseReviews({ courseId, userId, isEnrolled }: Props) {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["reviews", courseId],
    queryFn: () => fetchApprovedReviews(courseId),
    staleTime: 60_000,
  });

  const { data: mine } = useQuery({
    queryKey: ["review", "mine", courseId, userId],
    queryFn: () => (userId ? fetchMyReviewForCourse(courseId, userId) : Promise.resolve(null)),
    enabled: !!userId,
    staleTime: 60_000,
  });

  const submit = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error("Not signed in");
      const c = comment.trim();
      if (rating < 1 || rating > 5) throw new Error("Rating must be 1–5");
      if (c.length > 1000) throw new Error("Comment too long (max 1000)");
      const { error } = await submitReview(courseId, userId, rating, c);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Thank you! 🌸", description: "Your review is submitted and awaiting approval." });
      setComment("");
      qc.invalidateQueries({ queryKey: ["review", "mine", courseId, userId] });
      qc.invalidateQueries({ queryKey: ["reviews", courseId] });
    },
    onError: (e: any) => {
      toast({ title: "Could not submit", description: e.message || String(e), variant: "destructive" });
    },
  });

  const avg = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  return (
    <div id="reviews" className="glass-card rounded-2xl p-6 md:p-8">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <h2 className="font-serif text-2xl font-bold text-foreground">Student Reviews</h2>
        {reviews.length > 0 && (
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1"><Star className="h-4 w-4 text-gold fill-gold" /><span className="font-semibold text-foreground">{avg.toFixed(1)}</span></div>
            <span className="text-muted-foreground">({reviews.length} review{reviews.length === 1 ? "" : "s"})</span>
          </div>
        )}
      </div>

      {mine && (
        <div className="mb-6 p-4 border border-primary/20 rounded-xl bg-primary/5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-foreground">Your review</p>
            <Badge className={mine.isApproved ? "bg-emerald/20 text-emerald-light border-emerald/30" : "bg-gold/20 text-gold border-gold/30"}>
              {mine.isApproved ? "Approved" : "Pending approval"}
            </Badge>
          </div>
          <Stars value={mine.rating} />
          {mine.comment && <p className="mt-2 text-sm text-muted-foreground italic">"{mine.comment}"</p>}
        </div>
      )}

      {!mine && userId && isEnrolled && (
        <div className="mb-6 p-4 border border-border rounded-xl">
          <p className="text-sm font-medium text-foreground mb-2">Leave a review</p>
          <Stars value={rating} onChange={setRating} />
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share how this course helped you (optional)…"
            className="mt-3"
            maxLength={1000}
          />
          <Button className="mt-3" onClick={() => submit.mutate()} disabled={submit.isPending}>
            {submit.isPending ? "Submitting…" : "Submit review"}
          </Button>
        </div>
      )}

      {!mine && userId && !isEnrolled && (
        <p className="mb-6 text-sm text-muted-foreground italic">Only enrolled students can leave a review.</p>
      )}

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading reviews…</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">No reviews yet — be the first, in shaa Allah.</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((r) => (
            <li key={r.id} className="p-4 rounded-xl border border-border">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-sm font-medium text-foreground">{r.studentName || "Student"}</p>
                <Stars value={r.rating} size="h-4 w-4" />
              </div>
              {r.comment && <p className="text-sm text-muted-foreground leading-relaxed">{r.comment}</p>}
              <p className="text-[11px] text-muted-foreground/60 mt-1.5">
                {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
