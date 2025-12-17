import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { KanbanColumn } from "./KanbanColumn";
import { CandidateCard } from "./CandidateCard";
import { CandidateDetailSheet } from "./CandidateDetailSheet";
import { Candidate, CandidateStatus, COLUMN_ORDER } from "@/types/candidate";
import { mockCandidates } from "@/data/mockCandidates";
import { useToast } from "@/hooks/use-toast";

export function KanbanBoard() {
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);
  const [activeCandidate, setActiveCandidate] = useState<Candidate | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getCandidatesByStatus = (status: CandidateStatus) => {
    return candidates.filter((c) => c.status === status);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const candidate = candidates.find((c) => c.id === event.active.id);
    if (candidate) {
      setActiveCandidate(candidate);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeCandidate = candidates.find((c) => c.id === activeId);
    if (!activeCandidate) return;

    // Check if dropping on a column
    if (COLUMN_ORDER.includes(overId as CandidateStatus)) {
      if (activeCandidate.status !== overId) {
        setCandidates((prev) =>
          prev.map((c) =>
            c.id === activeId ? { ...c, status: overId as CandidateStatus } : c
          )
        );
      }
    } else {
      // Dropping on another card
      const overCandidate = candidates.find((c) => c.id === overId);
      if (overCandidate && activeCandidate.status !== overCandidate.status) {
        setCandidates((prev) =>
          prev.map((c) =>
            c.id === activeId ? { ...c, status: overCandidate.status } : c
          )
        );
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveCandidate(null);
  };

  const handleCandidateClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setSheetOpen(true);
  };

  const handleApprove = (candidate: Candidate) => {
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === candidate.id ? { ...c, status: "hired" as CandidateStatus } : c
      )
    );
    setSheetOpen(false);
    toast({
      title: "Candidate Approved",
      description: `${candidate.name} has been moved to Hired.`,
    });
  };

  const handleReject = (candidate: Candidate) => {
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === candidate.id ? { ...c, status: "rejected" as CandidateStatus } : c
      )
    );
    setSheetOpen(false);
    toast({
      title: "Candidate Rejected",
      description: `${candidate.name} has been moved to Rejected.`,
      variant: "destructive",
    });
  };

  const handleResumeUpload = (candidateId: string, resumeUrl: string) => {
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === candidateId ? { ...c, resumeUrl } : c
      )
    );
    // Update selected candidate if it's the same one
    if (selectedCandidate?.id === candidateId) {
      setSelectedCandidate((prev) => prev ? { ...prev, resumeUrl } : null);
    }
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUMN_ORDER.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              candidates={getCandidatesByStatus(status)}
              onCandidateClick={handleCandidateClick}
            />
          ))}
        </div>

        <DragOverlay>
          {activeCandidate && (
            <div className="rotate-3 opacity-90">
              <CandidateCard
                candidate={activeCandidate}
                onClick={() => {}}
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <CandidateDetailSheet
        candidate={selectedCandidate}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onApprove={handleApprove}
        onReject={handleReject}
        onResumeUpload={handleResumeUpload}
      />
    </>
  );
}
