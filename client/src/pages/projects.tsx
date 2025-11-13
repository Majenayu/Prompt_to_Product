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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertRenewableProjectSchema, projectStatuses, technologies, indianStates, type InsertRenewableProject, type RenewableProject } from "@shared/schema";
import { Plus, Search, Wind, Building, MapPin, Calendar, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const statusColors = {
  Planning: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  "Under Construction": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  Operational: "bg-primary/10 text-primary",
};

export default function Projects() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [technologyFilter, setTechnologyFilter] = useState<string>("all");
  const [stateFilter, setStateFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: projects, isLoading } = useQuery<RenewableProject[]>({
    queryKey: ["/api/projects"],
  });

  const form = useForm<InsertRenewableProject>({
    resolver: zodResolver(insertRenewableProjectSchema),
    defaultValues: {
      name: "",
      state: "",
      technology: "",
      capacity: "",
      status: "",
      description: "",
      investmentAmount: "",
      completionDate: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertRenewableProject) => {
      return await apiRequest("POST", "/api/projects", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Project created",
        description: "Renewable energy project has been added successfully.",
      });
      setDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredProjects = projects?.filter((project) => {
    const matchesSearch =
      searchQuery === "" ||
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.state.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    const matchesTechnology =
      technologyFilter === "all" || project.technology === technologyFilter;
    const matchesState = stateFilter === "all" || project.state === stateFilter;
    return matchesSearch && matchesStatus && matchesTechnology && matchesState;
  });

  const onSubmit = (data: InsertRenewableProject) => {
    createMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold mb-2" data-testid="text-projects-title">
            Renewable Energy Projects
          </h1>
          <p className="text-muted-foreground">
            Track and manage renewable energy projects across India
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-project">
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Project</DialogTitle>
              <DialogDescription>
                Register a new renewable energy project in the system
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Solar Park Phase 1" {...field} data-testid="input-project-name" />
                      </FormControl>
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
                            <SelectTrigger data-testid="select-project-state">
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
                    name="technology"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Technology</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-project-technology">
                              <SelectValue placeholder="Select technology" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {technologies.map((tech) => (
                              <SelectItem key={tech} value={tech}>
                                {tech}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Capacity (MW)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="100" {...field} data-testid="input-project-capacity" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-project-status">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {projectStatuses.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="investmentAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Investment Amount (₹)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="5000000" {...field} data-testid="input-project-investment" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="completionDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Completion Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} data-testid="input-project-completion" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Project details and objectives..."
                          {...field}
                          data-testid="input-project-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                    data-testid="button-cancel-project"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending} data-testid="button-submit-project">
                    {createMutation.isPending ? "Creating..." : "Create Project"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                data-testid="input-search-projects"
              />
            </div>
            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger data-testid="select-filter-state">
                <SelectValue placeholder="All States" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {indianStates.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={technologyFilter} onValueChange={setTechnologyFilter}>
              <SelectTrigger data-testid="select-filter-technology">
                <SelectValue placeholder="All Technologies" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Technologies</SelectItem>
                {technologies.map((tech) => (
                  <SelectItem key={tech} value={tech}>
                    {tech}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger data-testid="select-filter-status">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {projectStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects && filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <Card key={project.id} className="hover-elevate" data-testid={`card-project-${project.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <Badge className={statusColors[project.status as keyof typeof statusColors]}>
                    {project.status}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {project.description || "No description available"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">State:</span>
                    <span className="font-medium">{project.state}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Wind className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Technology:</span>
                    <span className="font-medium">{project.technology}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Capacity:</span>
                    <span className="font-mono font-medium">{project.capacity} MW</span>
                  </div>
                  {project.investmentAmount && (
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Investment:</span>
                      <span className="font-mono font-medium">
                        ₹{Number(project.investmentAmount).toLocaleString()}
                      </span>
                    </div>
                  )}
                  {project.completionDate && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Completion:</span>
                      <span className="font-medium">{project.completionDate}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Wind className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">No projects found</p>
            <p className="text-muted-foreground mb-4">
              {searchQuery || statusFilter !== "all" || technologyFilter !== "all" || stateFilter !== "all"
                ? "Try adjusting your filters"
                : "Get started by adding your first renewable energy project"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
