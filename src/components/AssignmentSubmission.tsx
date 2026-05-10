import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, CheckCircle, Send, X, File } from "lucide-react";
import type { Assignment } from "@/lib/mock-data";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";

interface AssignmentSubmissionProps {
  assignment: Assignment;
  onSubmit?: (data: { text: string; fileName?: string }) => void;
}

export default function AssignmentSubmission({ assignment, onSubmit }: AssignmentSubmissionProps) {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(assignment.submitted || false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (!text.trim() && !file) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      onSubmit?.({ text, fileName: file?.name });
    }, 1500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && f.size <= 20 * 1024 * 1024) setFile(f);
  };

  if (submitted || assignment.submitted) {
    return (
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-emerald-light shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-serif font-bold text-foreground">{assignment.title}</h4>
            <p className="text-sm text-muted-foreground mt-1">{assignment.description}</p>

            {assignment.submissionText && (
              <div className="mt-3 p-3 bg-muted/50 rounded-lg text-sm text-foreground">
                <p className="text-xs text-muted-foreground mb-1 font-medium">Your Response:</p>
                {assignment.submissionText}
              </div>
            )}

            <Badge variant="secondary" className="mt-3">✅ Submitted</Badge>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="glass-card rounded-xl p-5 cursor-pointer hover-lift group">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-gold shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-serif font-bold text-foreground group-hover:text-primary transition-colors">
                {assignment.title}
              </h4>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{assignment.description}</p>
              <div className="flex items-center gap-3 mt-2">
                <Badge variant="secondary" className="text-xs">Due: {assignment.dueDate}</Badge>
                <Button variant="emerald" size="sm" className="text-xs">
                  <Send className="mr-1 h-3 w-3" /> Submit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">{assignment.title}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">{assignment.description}</p>
        <p className="text-xs text-muted-foreground">Due: {assignment.dueDate}</p>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Your Response</Label>
            <Textarea
              placeholder="Type your answer here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label>Attach File (optional — max 20MB)</Label>
            <input
              type="file"
              ref={fileRef}
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp3,.mp4,.wav"
            />
            {file ? (
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <File className="h-4 w-4 text-primary" />
                <span className="text-sm flex-1 truncate">{file.name}</span>
                <span className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
                <button onClick={() => setFile(null)}><X className="h-4 w-4 text-muted-foreground hover:text-destructive" /></button>
              </div>
            ) : (
              <Button variant="outline" className="w-full" onClick={() => fileRef.current?.click()}>
                <Upload className="mr-2 h-4 w-4" /> Choose File
              </Button>
            )}
            <p className="text-xs text-muted-foreground">
              Accepted: PDF, DOC, Images (JPG/PNG), Audio (MP3/WAV), Video (MP4)
            </p>
          </div>

          <Button
            variant="emerald"
            className="w-full"
            disabled={(!text.trim() && !file) || submitting}
            onClick={handleSubmit}
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Submitting...
              </span>
            ) : (
              <><Send className="mr-2 h-4 w-4" /> Submit Assignment</>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
