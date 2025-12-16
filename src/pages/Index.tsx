import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, UserCheck, Clock, TrendingUp, TrendingDown } from "lucide-react";
import { mockCandidates } from "@/data/mockCandidates";

const stats = [
  {
    title: "Total Candidates",
    value: mockCandidates.length,
    change: "+12%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Active Jobs",
    value: 4,
    change: "+2",
    trend: "up",
    icon: Briefcase,
  },
  {
    title: "Hired This Month",
    value: mockCandidates.filter((c) => c.status === "hired").length,
    change: "+1",
    trend: "up",
    icon: UserCheck,
  },
  {
    title: "Avg. Time to Hire",
    value: "18 days",
    change: "-3 days",
    trend: "up",
    icon: Clock,
  },
];

const recentActivity = [
  { action: "Sarah Johnson applied for Senior Frontend Developer", time: "2 hours ago" },
  { action: "AI screening completed for Michael Chen", time: "4 hours ago" },
  { action: "Interview scheduled with Lisa Thompson", time: "Yesterday" },
  { action: "Amanda Foster moved to Hired", time: "2 days ago" },
  { action: "New job posting created: DevOps Engineer", time: "3 days ago" },
];

export default function Index() {
  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Welcome back! Here's your hiring overview."
    >
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                {stat.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-success" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-destructive" />
                )}
                <span className={stat.trend === "up" ? "text-success" : "text-destructive"}>
                  {stat.change}
                </span>
                <span>from last month</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Pipeline Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pipeline Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: "New Applications", count: mockCandidates.filter((c) => c.status === "new_application").length, color: "bg-primary" },
                { label: "AI Screening", count: mockCandidates.filter((c) => c.status === "ai_screening").length, color: "bg-chart-3" },
                { label: "Interview", count: mockCandidates.filter((c) => c.status === "interview").length, color: "bg-warning" },
                { label: "Hired", count: mockCandidates.filter((c) => c.status === "hired").length, color: "bg-success" },
                { label: "Rejected", count: mockCandidates.filter((c) => c.status === "rejected").length, color: "bg-destructive" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  <span className="text-sm font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                  <div>
                    <p className="text-sm">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
