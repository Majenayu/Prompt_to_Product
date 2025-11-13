import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCarbonEmissionSchema, organizationTypes, indianStates, type InsertCarbonEmission, type CarbonEmission } from "@shared/schema";
import { Calculator, Leaf, TrendingDown, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function CarbonCalculator() {
  const [step, setStep] = useState(1);
  const { toast } = useToast();

  const { data: emissions } = useQuery<CarbonEmission[]>({
    queryKey: ["/api/carbon-emissions"],
  });

  const form = useForm<InsertCarbonEmission>({
    resolver: zodResolver(insertCarbonEmissionSchema),
    defaultValues: {
      organizationName: "",
      organizationType: "",
      state: "",
      reportingPeriod: "",
      energyEmissions: "",
      transportEmissions: "",
      wasteEmissions: "",
      totalEmissions: "",
    },
  });

  const watchEnergy = form.watch("energyEmissions");
  const watchTransport = form.watch("transportEmissions");
  const watchWaste = form.watch("wasteEmissions");

  const calculateTotal = () => {
    const energy = Number(watchEnergy) || 0;
    const transport = Number(watchTransport) || 0;
    const waste = Number(watchWaste) || 0;
    return energy + transport + waste;
  };

  const totalEmissions = calculateTotal();

  const createMutation = useMutation({
    mutationFn: async (data: InsertCarbonEmission) => {
      const payload = {
        ...data,
        totalEmissions: calculateTotal().toString(),
      };
      return await apiRequest("POST", "/api/carbon-emissions", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/carbon-emissions"] });
      toast({
        title: "Report submitted",
        description: "Your carbon emission report has been saved successfully.",
      });
      form.reset();
      setStep(1);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertCarbonEmission) => {
    createMutation.mutate(data);
  };

  const averageEmissions = emissions
    ? emissions.reduce((sum, e) => sum + Number(e.totalEmissions), 0) / emissions.length
    : 0;

  const comparison = totalEmissions > 0 
    ? ((totalEmissions - averageEmissions) / averageEmissions) * 100
    : 0;

  const emissionBreakdown = [
    { category: "Energy", value: Number(watchEnergy) || 0, fill: "hsl(var(--chart-1))" },
    { category: "Transport", value: Number(watchTransport) || 0, fill: "hsl(var(--chart-2))" },
    { category: "Waste", value: Number(watchWaste) || 0, fill: "hsl(var(--chart-3))" },
  ];

  const progressPercent = (step / 3) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2" data-testid="text-carbon-title">
          Carbon Emission Calculator
        </h1>
        <p className="text-muted-foreground">
          Calculate and report your organization's carbon footprint
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Emission Report Form</CardTitle>
              <CardDescription>
                Step {step} of 3 - {step === 1 ? "Organization Details" : step === 2 ? "Emission Data" : "Review & Submit"}
              </CardDescription>
              <Progress value={progressPercent} className="mt-2" />
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {step === 1 && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="organizationName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Organization Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your organization" {...field} data-testid="input-org-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="organizationType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Organization Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-org-type">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {organizationTypes.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-org-state">
                                    <SelectValue placeholder="Select state" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {indianStates.map((state) => (
                                    <SelectItem key={state} value={state}>
                                      {state}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="reportingPeriod"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Reporting Period</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Q1 2024" {...field} data-testid="input-reporting-period" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="energyEmissions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Energy Consumption Emissions (tons CO₂)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="0.00" {...field} data-testid="input-energy-emissions" />
                            </FormControl>
                            <FormDescription>
                              Emissions from electricity, heating, and cooling
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="transportEmissions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Transportation Emissions (tons CO₂)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="0.00" {...field} data-testid="input-transport-emissions" />
                            </FormControl>
                            <FormDescription>
                              Emissions from vehicles, business travel, and logistics
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="wasteEmissions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Waste Management Emissions (tons CO₂)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="0.00" {...field} data-testid="input-waste-emissions" />
                            </FormControl>
                            <FormDescription>
                              Emissions from waste disposal and treatment
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-md border bg-muted/50">
                        <h3 className="font-semibold mb-2">Report Summary</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Organization:</span>
                            <span className="font-medium">{form.watch("organizationName")}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Type:</span>
                            <span className="font-medium">{form.watch("organizationType")}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Period:</span>
                            <span className="font-medium">{form.watch("reportingPeriod")}</span>
                          </div>
                          <div className="pt-2 border-t">
                            <div className="flex justify-between text-base">
                              <span className="font-semibold">Total Emissions:</span>
                              <span className="font-mono font-semibold text-primary">
                                {totalEmissions.toFixed(2)} tons CO₂
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={emissionBreakdown}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" />
                          <YAxis stroke="hsl(var(--muted-foreground))" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--popover))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "6px",
                            }}
                          />
                          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {emissionBreakdown.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  <div className="flex justify-between pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(Math.max(1, step - 1))}
                      disabled={step === 1}
                      data-testid="button-previous"
                    >
                      Previous
                    </Button>
                    {step < 3 ? (
                      <Button
                        type="button"
                        onClick={() => setStep(step + 1)}
                        data-testid="button-next"
                      >
                        Next
                      </Button>
                    ) : (
                      <Button 
                        type="submit" 
                        disabled={createMutation.isPending}
                        data-testid="button-submit-carbon"
                      >
                        {createMutation.isPending ? "Submitting..." : "Submit Report"}
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Running Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-3xl font-mono font-semibold" data-testid="text-total-emissions">
                    {totalEmissions.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">tons CO₂</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Benchmark Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {comparison > 0 ? (
                    <>
                      <TrendingDown className="h-5 w-5 text-destructive" />
                      <span className="text-sm">
                        <span className="font-semibold text-destructive">{comparison.toFixed(1)}%</span>
                        <span className="text-muted-foreground"> above average</span>
                      </span>
                    </>
                  ) : comparison < 0 ? (
                    <>
                      <Leaf className="h-5 w-5 text-primary" />
                      <span className="text-sm">
                        <span className="font-semibold text-primary">{Math.abs(comparison).toFixed(1)}%</span>
                        <span className="text-muted-foreground"> below average</span>
                      </span>
                    </>
                  ) : (
                    <span className="text-sm text-muted-foreground">No comparison data</span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  Average: {averageEmissions.toFixed(2)} tons CO₂
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Export Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" size="sm" data-testid="button-export-pdf">
                <Download className="h-4 w-4 mr-2" />
                Export as PDF
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm" data-testid="button-export-csv">
                <Download className="h-4 w-4 mr-2" />
                Export as CSV
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
