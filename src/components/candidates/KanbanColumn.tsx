import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CandidateCard } from "./CandidateCard";
import { Candidate, CandidateStatus, COLUMN_TITLES } from "@/types/candidate";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  status: CandidateStatus;
  candidates: Candidate[];
  onCandidateClick: (candidate: Candidate) => void;
}

export function KanbanColumn({ status, candidates, onCandidateClick }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  const columnColors: Record<CandidateStatus, string> = {
    new_application: "border-t-primary",
    ai_screening: "border-t-chart-3",
    interview: "border-t-warning",
    hired: "border-t-success",
    rejected: "border-t-destructive",
  };

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex-1 min-w-[280px] max-w-[320px] bg-muted/30 rounded-lg border-t-4 transition-colors",
        columnColors[status],
        isOver && "bg-accent/50"
      )}
    >
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-foreground text-sm">
            {COLUMN_TITLES[status]}
          </h2>
          <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
            {candidates.length}
          </span>
        </div>
      </div>
      <div className="p-3 space-y-3 min-h-[200px]">
        <SortableContext
          items={candidates.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {candidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              onClick={() => onCandidateClick(candidate)}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
