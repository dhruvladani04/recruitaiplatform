import { cn } from "@/lib/utils";

interface ScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

export function ScoreBadge({ score, size = "sm" }: ScoreBadgeProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-success text-success-foreground";
    if (score >= 50) return "bg-warning text-warning-foreground";
    return "bg-destructive text-destructive-foreground";
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5 min-w-[36px]",
    md: "text-sm px-3 py-1 min-w-[48px]",
    lg: "text-2xl font-bold px-6 py-3 min-w-[80px]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium",
        getScoreColor(score),
        sizeClasses[size]
      )}
    >
      {score}
    </span>
  );
}
