import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import type { RegionalCapacity, RenewableProject, CarbonEmission } from "@shared/schema";
import { TrendingUp, BarChart3, PieChart, Activity } from "lucide-react";

export default function Analytics() {
  const { data: regionalData, isLoading: regionLoading } = useQuery<RegionalCapacity[]>({
    queryKey: ["/api/regional-capacity"],
  });

  const { data: projects, isLoading: projectsLoading } = useQuery<RenewableProject[]>({
    queryKey: ["/api/projects"],
  });

  const { data: emissions, isLoading: emissionsLoading } = useQuery<CarbonEmission[]>({
    queryKey: ["/api/carbon-emissions"],
  });

  const topStates = regionalData
    ? [...regionalData]
        .sort((a, b) => Number(b.totalCapacity) - Number(a.totalCapacity))
        .slice(0, 10)
        .map((state) => ({
          state: state.state.length > 12 ? state.state.substring(0, 10) + "..." : state.state,
          capacity: Number(state.totalCapacity),
          target: Number(state.targetCapacity),
        }))
    : [];

  const technologyTrend = [
    {
      year: "2020",
      Solar: 38000,
      Wind: 39000,
      Hydro: 46000,
    },
    {
      year: "2021",
      Solar: 50000,
      Wind: 40500,
      Hydro: 47000,
    },
    {
      year: "2022",
      Solar: 68000,
      Wind: 42000,
      Hydro: 48000,
    },
    {
      year: "2023",
      Solar: 88000,
      Wind: 43500,
      Hydro: 49000,
    },
    {
      year: "2024",
      Solar: 115000,
      Wind: 45000,
      Hydro: 50000,
    },
  ];

  const emissionsByType = emissions
    ?.reduce(
      (acc, emission) => {
        return {
          energy: acc.energy + Number(emission.energyEmissions),
          transport: acc.transport + Number(emission.transportEmissions),
          waste: acc.waste + Number(emission.wasteEmissions),
        };
      },
      { energy: 0, transport: 0, waste: 0 }
    );

  const emissionsData = emissionsByType
    ? [
        { category: "Energy", value: emissionsByType.energy },
        { category: "Transport", value: emissionsByType.transport },
        { category: "Waste", value: emissionsByType.waste },
      ]
    : [];

  const technologies = ["Solar", "Wind", "Hydro", "Biomass", "Nuclear"];

  const projectsByTechnology = projects?.reduce((acc: Record<string, number>, project) => {
    acc[project.technology] = (acc[project.technology] || 0) + 1;
    return acc;
  }, {});

  const radarData = technologies.map((tech) => ({
    technology: tech,
    projects: projectsByTechnology?.[tech] || 0,
    capacity:
      regionalData?.reduce((sum, r) => {
        if (tech === "Solar") return sum + Number(r.solarCapacity);
        if (tech === "Wind") return sum + Number(r.windCapacity);
        if (tech === "Hydro") return sum + Number(r.hydroCapacity);
        return sum;
      }, 0) || 0,
  })).filter((d) => d.projects > 0 || d.capacity > 0);

  const cumulativeData = [
    { month: "Jan", cumulative: 145000 },
    { month: "Feb", cumulative: 148500 },
    { month: "Mar", cumulative: 152200 },
    { month: "Apr", cumulative: 156800 },
    { month: "May", cumulative: 161500 },
    { month: "Jun", cumulative: 167200 },
  ];

  if (regionLoading || projectsLoading || emissionsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-96" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2" data-testid="text-analytics-title">
          Advanced Analytics
        </h1>
        <p className="text-muted-foreground">
          Deep insights into renewable energy trends and carbon emissions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold font-mono text-primary">+24.5%</div>
            <p className="text-xs text-muted-foreground mt-1">Year over year</p>
          </CardContent>
        </Card>
        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Project Size</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold font-mono">
              {projects && projects.length > 0
                ? (
                    projects.reduce((sum, p) => sum + Number(p.capacity), 0) / projects.length
                  ).toFixed(0)
                : 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">MW per project</p>
          </CardContent>
        </Card>
        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Emissions</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold font-mono">
              {emissions && emissions.length > 0
                ? (
                    emissions.reduce((sum, e) => sum + Number(e.totalEmissions), 0) /
                    emissions.length
                  ).toFixed(0)
                : 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">tons CO₂ per org</p>
          </CardContent>
        </Card>
        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active States</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold font-mono">
              {regionalData?.filter((r) => Number(r.totalCapacity) > 1000).length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">With major capacity</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Technology Growth Trends</CardTitle>
            <CardDescription>Capacity evolution by technology type (MW)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={technologyTrend}>
                <defs>
                  <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorWind" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorHydro" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="Solar"
                  stroke="hsl(var(--chart-3))"
                  fillOpacity={1}
                  fill="url(#colorSolar)"
                />
                <Area
                  type="monotone"
                  dataKey="Wind"
                  stroke="hsl(var(--chart-2))"
                  fillOpacity={1}
                  fill="url(#colorWind)"
                />
                <Area
                  type="monotone"
                  dataKey="Hydro"
                  stroke="hsl(var(--chart-1))"
                  fillOpacity={1}
                  fill="url(#colorHydro)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top States by Capacity</CardTitle>
            <CardDescription>Installed vs target capacity comparison (MW)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={topStates} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis
                  dataKey="state"
                  type="category"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  width={100}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                />
                <Legend />
                <Bar dataKey="capacity" fill="hsl(var(--primary))" name="Current" radius={[0, 4, 4, 0]} />
                <Bar dataKey="target" fill="hsl(var(--muted))" name="Target" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cumulative Capacity Growth</CardTitle>
            <CardDescription>Total renewable energy capacity over time (MW)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={cumulativeData}>
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
                <Line
                  type="monotone"
                  dataKey="cumulative"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", r: 4 }}
                  name="Cumulative Capacity"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Carbon Emissions by Category</CardTitle>
            <CardDescription>Total reported emissions breakdown (tons CO₂)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={emissionsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                />
                <Bar dataKey="value" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {radarData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Technology Distribution Analysis</CardTitle>
            <CardDescription>Project count and capacity by technology type</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="technology" stroke="hsl(var(--muted-foreground))" />
                <PolarRadiusAxis stroke="hsl(var(--muted-foreground))" />
                <Radar
                  name="Projects"
                  dataKey="projects"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.5}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
