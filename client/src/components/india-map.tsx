import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RegionalCapacity } from "@shared/schema";
import { MapPin } from "lucide-react";

interface IndiaMapProps {
  data: RegionalCapacity[];
  onStateClick?: (state: string) => void;
}

export function IndiaMap({ data, onStateClick }: IndiaMapProps) {
  const getProgressColor = (current: number, target: number) => {
    const progress = (current / target) * 100;
    if (progress >= 80) return "hsl(var(--primary))";
    if (progress >= 50) return "hsl(var(--chart-3))";
    if (progress >= 25) return "hsl(var(--chart-4))";
    return "hsl(var(--muted))";
  };

  const topStates = [...data]
    .sort((a, b) => Number(b.totalCapacity) - Number(a.totalCapacity))
    .slice(0, 10);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Regional Capacity Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topStates.map((state) => {
              const progress =
                (Number(state.totalCapacity) / Number(state.targetCapacity)) * 100;
              const color = getProgressColor(
                Number(state.totalCapacity),
                Number(state.targetCapacity)
              );

              return (
                <div
                  key={state.state}
                  className="p-4 rounded-md border border-border hover-elevate cursor-pointer"
                  onClick={() => onStateClick?.(state.state)}
                  data-testid={`state-${state.state.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-sm">{state.state}</div>
                    <div className="text-xs text-muted-foreground">
                      {progress.toFixed(0)}%
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-300"
                        style={{
                          width: `${Math.min(progress, 100)}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <div className="text-muted-foreground">Solar</div>
                        <div className="font-mono font-medium">
                          {state.solarCapacity} MW
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Wind</div>
                        <div className="font-mono font-medium">
                          {state.windCapacity} MW
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Hydro</div>
                        <div className="font-mono font-medium">
                          {state.hydroCapacity} MW
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-xs text-muted-foreground text-center pt-2 border-t">
            Click on a state to view detailed information
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
