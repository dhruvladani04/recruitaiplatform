import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ScoreBadge } from "./ScoreBadge";
import { Candidate } from "@/types/candidate";
import { cn } from "@/lib/utils";

interface CandidateCardProps {
  candidate: Candidate;
  onClick: () => void;
}

export function CandidateCard({ candidate, onClick }: CandidateCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: candidate.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const initials = candidate.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={cn(
        "cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-200 relative group",
        isDragging && "opacity-50 shadow-lg rotate-2"
      )}
    >
      <CardContent className="p-4">
        <div className="absolute top-3 right-3">
          <ScoreBadge score={candidate.score} />
        </div>
        <div className="flex items-start gap-3 pr-12">
          <Avatar className="h-10 w-10 border-2 border-border">
            <AvatarImage src={candidate.avatar} alt={candidate.name} />
            <AvatarFallback className="bg-muted text-muted-foreground text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground truncate text-sm">
              {candidate.name}
            </h3>
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {candidate.role}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
