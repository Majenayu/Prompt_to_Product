import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
  className?: string;
}

export function MetricCard({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  subtitle,
  className,
}: MetricCardProps) {
  return (
    <Card className={cn("hover-elevate", className)}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <div className="text-sm font-medium text-muted-foreground">{title}</div>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-semibold font-mono" data-testid={`metric-${title.toLowerCase().replace(/\s+/g, '-')}`}>
              {value}
            </div>
            {unit && <div className="text-lg text-muted-foreground">{unit}</div>}
          </div>
          {trend && (
            <div className="flex items-center gap-1 text-sm">
              {trend.isPositive ? (
                <TrendingUp className="h-4 w-4 text-primary" />
              ) : (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
              <span
                className={cn(
                  "font-medium",
                  trend.isPositive ? "text-primary" : "text-destructive"
                )}
              >
                {trend.value}%
              </span>
              <span className="text-muted-foreground">vs last year</span>
            </div>
          )}
          {subtitle && (
            <div className="text-sm text-muted-foreground">{subtitle}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
