import { useQuery } from "@tanstack/react-query";
import { MetricCard } from "@/components/metric-card";
import { IndiaMap } from "@/components/india-map";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import {
  Zap,
  Target,
  Leaf,
  Building2,
} from "lucide-react";
import type { RegionalCapacity, RenewableProject, CarbonEmission } from "@shared/schema";

export default function Dashboard() {
  const { data: regionalData, isLoading: regionLoading } = useQuery<RegionalCapacity[]>({
    queryKey: ["/api/regional-capacity"],
  });

  const { data: projects, isLoading: projectsLoading } = useQuery<RenewableProject[]>({
    queryKey: ["/api/projects"],
  });

  const { data: emissions, isLoading: emissionsLoading } = useQuery<CarbonEmission[]>({
    queryKey: ["/api/carbon-emissions"],
  });

  const totalCapacity = regionalData?.reduce(
    (sum, region) => sum + Number(region.totalCapacity),
    0
  ) || 0;

  const totalTarget = regionalData?.reduce(
    (sum, region) => sum + Number(region.targetCapacity),
    0
  ) || 0;

  const totalCarbonReduced = emissions?.reduce(
    (sum, emission) => sum + Number(emission.totalEmissions),
    0
  ) || 0;

  const activeProjects = projects?.filter((p) => p.status === "Operational").length || 0;

  const targetProgress = totalTarget > 0 ? (totalCapacity / totalTarget) * 100 : 0;

  const technologyData = [
    {
      name: "Solar",
      value: regionalData?.reduce((sum, r) => sum + Number(r.solarCapacity), 0) || 0,
      fill: "hsl(var(--chart-3))",
    },
    {
      name: "Wind",
      value: regionalData?.reduce((sum, r) => sum + Number(r.windCapacity), 0) || 0,
      fill: "hsl(var(--chart-2))",
    },
    {
      name: "Hydro",
      value: regionalData?.reduce((sum, r) => sum + Number(r.hydroCapacity), 0) || 0,
      fill: "hsl(var(--chart-1))",
    },
  ];

  const projectStatusData = [
    { status: "Planning", count: projects?.filter((p) => p.status === "Planning").length || 0 },
    { status: "Approved", count: projects?.filter((p) => p.status === "Approved").length || 0 },
    { status: "Under Construction", count: projects?.filter((p) => p.status === "Under Construction").length || 0 },
    { status: "Operational", count: projects?.filter((p) => p.status === "Operational").length || 0 },
  ];

  const monthlyData = [
    { month: "Jan", capacity: 145000, emissions: 42000 },
    { month: "Feb", capacity: 148000, emissions: 41500 },
    { month: "Mar", capacity: 152000, emissions: 40800 },
    { month: "Apr", capacity: 156000, emissions: 40200 },
    { month: "May", capacity: 160000, emissions: 39500 },
    { month: "Jun", capacity: 165000, emissions: 38900 },
  ];

  if (regionLoading || projectsLoading || emissionsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2" data-testid="text-dashboard-title">
          India Renewable Energy Dashboard
        </h1>
        <p className="text-muted-foreground">
          Real-time tracking of renewable energy capacity and carbon emission reduction
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Capacity"
          value={totalCapacity.toFixed(0)}
          unit="MW"
          icon={Zap}
          trend={{ value: 12.5, isPositive: true }}
          subtitle="Renewable energy installed"
        />
        <MetricCard
          title="Target Progress"
          value={targetProgress.toFixed(1)}
          unit="%"
          icon={Target}
          trend={{ value: 8.3, isPositive: true }}
          subtitle={`${totalTarget.toFixed(0)} MW target`}
        />
        <MetricCard
          title="Carbon Tracked"
          value={totalCarbonReduced.toFixed(0)}
          unit="tons"
          icon={Leaf}
          subtitle="Total emissions reported"
        />
        <MetricCard
          title="Active Projects"
          value={activeProjects}
          icon={Building2}
          trend={{ value: 15.2, isPositive: true }}
          subtitle="Currently operational"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <IndiaMap data={regionalData || []} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Energy Mix</CardTitle>
            <CardDescription>Capacity by technology type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={technologyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={90}
                  dataKey="value"
                >
                  {technologyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Status Distribution</CardTitle>
            <CardDescription>Current project pipeline</CardDescription>
          </CardHeader>
          <CardContent>
            {projectsLoading ? (
              <Skeleton className="h-[300px]" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={projectStatusData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="status" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Growth Trends</CardTitle>
            <CardDescription>Capacity growth and emission reduction</CardDescription>
          </CardHeader>
          <CardContent>
            {regionLoading ? (
              <Skeleton className="h-[300px]" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="capacity"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    name="Capacity (MW)"
                  />
                  <Line
                    type="monotone"
                    dataKey="emissions"
                    stroke="hsl(var(--chart-4))"
                    strokeWidth={2}
                    name="Emissions (tons)"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
