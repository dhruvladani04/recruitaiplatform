import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScoreBadge } from "./ScoreBadge";
import { ResumeViewer } from "./ResumeViewer";
import { Candidate } from "@/types/candidate";
import { FileText, Mail, Phone, Calendar, CheckCircle, XCircle, Sparkles, ThumbsUp, ThumbsDown, Upload } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface CandidateDetailSheetProps {
  candidate: Candidate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (candidate: Candidate) => void;
  onReject: (candidate: Candidate) => void;
  onResumeUpload?: (candidateId: string, resumeUrl: string) => void;
}

export function CandidateDetailSheet({
  candidate,
  open,
  onOpenChange,
  onApprove,
  onReject,
  onResumeUpload,
}: CandidateDetailSheetProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localResumeUrl, setLocalResumeUrl] = useState<string | null>(null);

  if (!candidate) return null;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    const url = URL.createObjectURL(file);
    setLocalResumeUrl(url);
    onResumeUpload?.(candidate.id, url);
    toast.success("Resume uploaded successfully");
  };

  const currentResumeUrl = localResumeUrl || candidate.resumeUrl;

  const initials = candidate.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[90vw] sm:w-[80vw] sm:max-w-[1200px] p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="p-6 border-b border-border bg-card">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16 border-2 border-border">
                <AvatarImage src={candidate.avatar} alt={candidate.name} />
                <AvatarFallback className="bg-muted text-muted-foreground text-lg">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <SheetTitle className="text-xl">{candidate.name}</SheetTitle>
                <p className="text-muted-foreground mt-1">{candidate.role}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-4 w-4" />
                    {candidate.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-4 w-4" />
                    {candidate.phone}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    Applied {candidate.appliedDate}
                  </span>
                </div>
              </div>
            </div>
          </SheetHeader>

          {/* Content - Two Column Layout */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Column - Resume Viewer */}
            <div className="w-1/2 border-r border-border p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Resume</h3>
                </div>
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="application/pdf"
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload PDF
                  </Button>
                </div>
              </div>
              <div className="flex-1 min-h-0">
                <ResumeViewer url={currentResumeUrl} />
              </div>
            </div>

            {/* Right Column - AI Analysis */}
            <div className="w-1/2 p-6 overflow-auto bg-card/50">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">AI Analysis</h3>
              </div>

              {/* Match Score */}
              <div className="bg-card rounded-xl border border-border p-6 mb-6 text-center">
                <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                  Match Score
                </p>
                <ScoreBadge score={candidate.score} size="lg" />
              </div>

              {/* Summary */}
              <div className="mb-6">
                <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Summary
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed bg-card rounded-lg border border-border p-4">
                  {candidate.summary}
                </p>
              </div>

              {/* Strengths */}
              <div className="mb-6">
                <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4 text-success" />
                  Strengths
                </h4>
                <ul className="space-y-2">
                  {candidate.strengths.map((strength, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-muted-foreground bg-success/10 rounded-lg p-3 border border-success/20"
                    >
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 shrink-0" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="mb-8">
                <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                  <ThumbsDown className="h-4 w-4 text-destructive" />
                  Weaknesses
                </h4>
                <ul className="space-y-2">
                  {candidate.weaknesses.map((weakness, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-muted-foreground bg-destructive/10 rounded-lg p-3 border border-destructive/20"
                    >
                      <XCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                      {weakness}
                    </li>
                  ))}
                </ul>
              </div>

              <Separator className="my-6" />

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="default"
                  className="flex-1 bg-success hover:bg-success/90"
                  onClick={() => onApprove(candidate)}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => onReject(candidate)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
