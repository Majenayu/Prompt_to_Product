import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { insertFinancingSchemeSchema, schemeCategories, technologies, type InsertFinancingScheme, type FinancingScheme } from "@shared/schema";
import { DollarSign, Plus, Search, Calendar, FileText, Tag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const categoryColors = {
  Subsidies: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Loans: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Grants: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  "Tax Incentives": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
};

export default function Financing() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<FinancingScheme | null>(null);
  const { toast } = useToast();

  const { data: schemes, isLoading } = useQuery<FinancingScheme[]>({
    queryKey: ["/api/financing-schemes"],
  });

  const form = useForm<InsertFinancingScheme>({
    resolver: zodResolver(insertFinancingSchemeSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      fundingAmount: "",
      eligibility: "",
      applicationDeadline: "",
      targetTechnology: "",
      contactInfo: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertFinancingScheme) => {
      return await apiRequest("POST", "/api/financing-schemes", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/financing-schemes"] });
      toast({
        title: "Scheme added",
        description: "Financing scheme has been added successfully.",
      });
      setDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add scheme. Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredSchemes = schemes?.filter((scheme) => {
    const matchesSearch =
      searchQuery === "" ||
      scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || scheme.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const onSubmit = (data: InsertFinancingScheme) => {
    createMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold mb-2" data-testid="text-financing-title">
            Financing Hub
          </h1>
          <p className="text-muted-foreground">
            Explore funding opportunities for renewable energy projects
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-scheme">
              <Plus className="h-4 w-4 mr-2" />
              Add Scheme
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Financing Scheme</DialogTitle>
              <DialogDescription>
                Add a new financing scheme or incentive program
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Scheme Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Solar Subsidy Program 2024" {...field} data-testid="input-scheme-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-scheme-category">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {schemeCategories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
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
                    name="targetTechnology"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Technology</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                          <FormControl>
                            <SelectTrigger data-testid="select-scheme-technology">
                              <SelectValue placeholder="Select technology" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="All">All Technologies</SelectItem>
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
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Detailed description of the scheme..."
                          {...field}
                          data-testid="input-scheme-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fundingAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Funding Amount</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Up to ₹50 lakhs" {...field} data-testid="input-scheme-funding" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="applicationDeadline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Application Deadline</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., March 31, 2024" {...field} data-testid="input-scheme-deadline" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="eligibility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Eligibility Criteria</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Who can apply for this scheme..."
                          {...field}
                          data-testid="input-scheme-eligibility"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Information</FormLabel>
                      <FormControl>
                        <Input placeholder="Email or website" {...field} data-testid="input-scheme-contact" />
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
                    data-testid="button-cancel-scheme"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending} data-testid="button-submit-scheme">
                    {createMutation.isPending ? "Adding..." : "Add Scheme"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Financing Schemes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search schemes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                data-testid="input-search-schemes"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger data-testid="select-filter-category">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {schemeCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSchemes && filteredSchemes.length > 0 ? (
          filteredSchemes.map((scheme) => (
            <Card key={scheme.id} className="hover-elevate flex flex-col" data-testid={`card-scheme-${scheme.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <CardTitle className="text-lg">{scheme.name}</CardTitle>
                  <Badge className={categoryColors[scheme.category as keyof typeof categoryColors]}>
                    {scheme.category}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-3">
                  {scheme.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Funding:</span>
                    <span className="font-medium">{scheme.fundingAmount}</span>
                  </div>
                  {scheme.targetTechnology && (
                    <div className="flex items-center gap-2 text-sm">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">For:</span>
                      <span className="font-medium">{scheme.targetTechnology}</span>
                    </div>
                  )}
                  {scheme.applicationDeadline && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Deadline:</span>
                      <span className="font-medium">{scheme.applicationDeadline}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setSelectedScheme(scheme)}
                  data-testid={`button-view-scheme-${scheme.id}`}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">No schemes found</p>
            <p className="text-muted-foreground mb-4">
              {searchQuery || categoryFilter !== "all"
                ? "Try adjusting your filters"
                : "Get started by adding financing schemes"}
            </p>
          </div>
        )}
      </div>

      {selectedScheme && (
        <Dialog open={!!selectedScheme} onOpenChange={() => setSelectedScheme(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedScheme.name}
                <Badge className={categoryColors[selectedScheme.category as keyof typeof categoryColors]}>
                  {selectedScheme.category}
                </Badge>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">{selectedScheme.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-1 text-sm">Funding Amount</h4>
                  <p className="text-sm">{selectedScheme.fundingAmount}</p>
                </div>
                {selectedScheme.applicationDeadline && (
                  <div>
                    <h4 className="font-semibold mb-1 text-sm">Application Deadline</h4>
                    <p className="text-sm">{selectedScheme.applicationDeadline}</p>
                  </div>
                )}
              </div>
              {selectedScheme.targetTechnology && (
                <div>
                  <h4 className="font-semibold mb-1 text-sm">Target Technology</h4>
                  <p className="text-sm">{selectedScheme.targetTechnology}</p>
                </div>
              )}
              <div>
                <h4 className="font-semibold mb-2">Eligibility Criteria</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {selectedScheme.eligibility}
                </p>
              </div>
              {selectedScheme.contactInfo && (
                <div>
                  <h4 className="font-semibold mb-1 text-sm">Contact Information</h4>
                  <p className="text-sm">{selectedScheme.contactInfo}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
