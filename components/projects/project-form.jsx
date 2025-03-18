"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CalendarIcon, Plus, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { AddClientDialog } from "@/components/projects/add-client-dialog";
import { getClients } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import ImageUpload from "../ImageUpload";

export function ProjectForm({ onSubmit, isSubmitting = false, initialData }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  const [date, setDate] = useState(
    initialData?.dueDate ? new Date(initialData.dueDate) : undefined
  );
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    status: initialData?.status || "planning",
    budget: initialData?.budget || "",
    clientId: initialData?.client?.id || "",
    notes: initialData?.notes || "",
    comments: initialData?.comments || "",
    image: initialData?.image || "",
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await getClients();
        setClients(data);
      } catch (error) {
        console.error("Failed to fetch clients:", error);
        toast({
          title: "Error",
          description: "Failed to load clients. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [toast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  const handleImageUpload = (imageUrl) => {
    setFormData((prevState) => ({
      ...prevState,
      image: imageUrl,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title) {
      toast({
        title: "Validation Error",
        description: "Project title is required",
        variant: "destructive",
      });
      return;
    }

    if (!date) {
      toast({
        title: "Validation Error",
        description: "Due date is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.clientId) {
      toast({
        title: "Validation Error",
        description: "Please select a client",
        variant: "destructive",
      });
      return;
    }

    const client = clients.find((c) => c.id === formData.clientId);

    const projectData = {
      ...formData,
      budget: Number.parseFloat(formData.budget) || 0,
      dueDate: date.toISOString().split("T")[0],
      client: client,
      progress: initialData?.progress || 0,
    };

    if (onSubmit) {
      onSubmit(projectData);
    } else {
      router.push("/dashboard");
    }
  };

  const handleCancel = () => {
    router.push("/dashboard");
  };

  const handleClientAdded = (newClient) => {
    setClients((prev) => [...prev, newClient])
    setFormData((prev) => ({
      ...prev,
      clientId: newClient._id,
    }))
  }
  const handleClientChange = (newClient) => {
    if (newClient && newClient._id) {
      setFormData((prev) => ({
        ...prev,
        clientId: newClient._id,
      }));
      toast({
        title: "Client Updated",
        description: `Client changed to ${newClient.name}`,
      });
    }
    setIsClientDialogOpen(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>
              Enter the basic information about your project
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter project title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the project"
                className="min-h-[120px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Budget ($)</Label>
                <Input
                  id="budget"
                  name="budget"
                  type="number"
                  value={formData.budget}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <Label>Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Project Image</Label>
              <div className="flex flex-col gap-4">
                {formData.image && (
                  <div className="relative rounded-lg overflow-hidden border h-40">
                    <img
                      src={formData.image || "/placeholder.svg"}
                      alt="Project preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <ImageUpload onImageUpload={handleImageUpload} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Client Information</CardTitle>
                  <CardDescription>
                    Select an existing client or add a new one
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsClientDialogOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Client
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* <div className="space-y-2">
                  <Label htmlFor="client">Select Client</Label>
                  <Select value={formData.clientId} onValueChange={(value) => handleSelectChange("clientId", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {loading ? (
                        <SelectItem value="loading" disabled>
                          Loading clients...
                        </SelectItem>
                      ) : clients.length > 0 ? (
                        clients.map((client) => (
                          <SelectItem key={client._id} value={client._id}>
                            {client.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          No clients available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div> */}

                {formData.clientId ? (
                  <div className="mt-4">
                    {clients.map(
                      (client) =>
                        client._id === formData.clientId && (
                          <div
                            key={client._id}
                            className="mt-4 flex items-center gap-4 p-4 rounded-lg border"
                          >
                            <div className="h-16 w-16 rounded-full overflow-hidden border">
                              <img
                                src={
                                  client.image ||
                                  "/placeholder.svg?height=64&width=64"
                                }
                                alt={client.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium">{client.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {client.email}
                              </p>
                              {client.phone && (
                                <p className="text-sm text-muted-foreground">
                                  {client.phone}
                                </p>
                              )}
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setIsClientDialogOpen(true)}
                            >
                              Change
                            </Button>
                          </div>
                        )
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-24 border border-dashed rounded-md p-4 text-muted-foreground">
                    <p className="text-sm">No client selected</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2"
                      onClick={() => setIsClientDialogOpen(true)}
                    >
                      Select Client
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
              <CardDescription>
                Add notes and comments about the project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="notes">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                  <TabsTrigger value="comments">Comments</TabsTrigger>
                </TabsList>
                <TabsContent value="notes" className="space-y-4 pt-4">
                  <Textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Add private notes about this project"
                    className="min-h-[150px]"
                  />
                </TabsContent>
                <TabsContent value="comments" className="space-y-4 pt-4">
                  <Textarea
                    name="comments"
                    value={formData.comments}
                    onChange={handleInputChange}
                    placeholder="Add comments that will be visible to the team"
                    className="min-h-[150px]"
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <Button type="button" variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Creating..."
            : initialData
            ? "Save Changes"
            : "Create Project"}
        </Button>
      </div>

      <AddClientDialog
        open={isClientDialogOpen}
        onOpenChange={setIsClientDialogOpen}
        clients={formData.clientId}
        onClientSelected={handleClientChange}
        onClientAdded={handleClientAdded}
      />
    </form>
  );
}
