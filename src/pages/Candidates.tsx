import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KanbanBoard } from "@/components/candidates/KanbanBoard";

export default function Candidates() {
  return (
    <DashboardLayout 
      title="Candidates" 
      subtitle="Manage your candidate pipeline"
    >
      <KanbanBoard />
    </DashboardLayout>
  );
}
