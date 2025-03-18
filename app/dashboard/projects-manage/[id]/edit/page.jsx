// "use client"

// import { useEffect, useState } from "react"
// import { useRouter } from "next/navigation"
// import { ChevronLeft, CalendarIcon } from "lucide-react"
// import Link from "next/link"

// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Calendar } from "@/components/ui/calendar"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { format } from "date-fns"
// import { cn } from "@/lib/utils"
// import { AddClientDialog } from "@/components/projects/add-client-dialog"
// import ImageUpload from "@/components/ImageUpload"
// import { getProject, updateProject, getClients } from "@/lib/api"
// import { useToast } from "@/hooks/use-toast"

// export default function EditProject({ params }) {
//   const router = useRouter()
//   const { toast } = useToast()
//   const [project, setProject] = useState({
//     title: "",
//     description: "",
//     status: "planning",
//     budget: 0,
//     dueDate: null,
//     client: {},
//     notes: "",
//     comments: "",
//     image: "",
//   })
//   const [isClientDialogOpen, setIsClientDialogOpen] = useState(false)
//   const [date, setDate] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [clients, setClients] = useState([])
//   const [isSubmitting, setIsSubmitting] = useState(false)

  

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true)
//         // Fetch project data
//         const projectData = await getProject(params.id)

//         // Format the date
//         const dueDate = projectData.dueDate ? new Date(projectData.dueDate) : null

//         setProject({
//           ...projectData,
//           dueDate,
//         })
//         setDate(dueDate)

//         // Fetch clients for the client selection dialog
//         const clientsData = await getClients()
//         setClients(clientsData)
//       } catch (error) {
//         console.error("Failed to fetch project data:", error)
//         toast({
//           title: "Error",
//           description: "Failed to load project data. Please try again.",
//           variant: "destructive",
//         })
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [params.id, toast])

//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     if (!project.title) {
//       toast({
//         title: "Validation Error",
//         description: "Project title is required",
//         variant: "destructive",
//       })
//       return
//     }

//     if (!date) {
//       toast({
//         title: "Validation Error",
//         description: "Due date is required",
//         variant: "destructive",
//       })
//       return
//     }

//     if (!project.client || !project.client._id) {
//       toast({
//         title: "Validation Error",
//         description: "Please select a client",
//         variant: "destructive",
//       })
//       return
//     }

//     try {
//       setIsSubmitting(true)

//       // Prepare the data for submission
//       const updatedProject = {
//         ...project,
//         dueDate: date.toISOString(),
//         budget: Number(project.budget),
//       }

//       // Update the project
//       await updateProject(params.id, updatedProject)

//       toast({
//         title: "Success",
//         description: "Project updated successfully",
//       })

//       // Redirect to projects list
//       router.push("/dashboard/projects-manage")
//     } catch (error) {
//       console.error("Failed to update project:", error)
//       toast({
//         title: "Error",
//         description: "Failed to update project. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const handleInputChange = (e) => {
//     const { name, value } = e.target
//     setProject((prev) => ({
//       ...prev,
//       [name]: value,
//     }))
//   }

//   const handleImageUpload = (imageUrl) => {
//     setProject((prev) => ({
//       ...prev,
//       image: imageUrl,
//     }))
//   }

//   const handleDateChange = (newDate) => {
//     setDate(newDate)
//   }

//   const handleStatusChange = (value) => {
//     setProject((prev) => ({
//       ...prev,
//       status: value,
//     }))
//   }

//   const handleClientChange = (newClient) => {
//     setProject((prev) => ({
//       ...prev,
//       client: newClient,
//     }))
//     setIsClientDialogOpen(false)
//   }



  
//   const handleSelectChange = (name, selectedClient) => {
//     setProject((prev) => ({
//       ...prev,
//       client: selectedClient,
//     }))
//   }
 

//   if (loading) {
//     return (
//       <div className="container mx-auto py-6 space-y-6">
//         <div className="flex items-center gap-2">
//           <Button variant="ghost" size="sm" disabled>
//             <ChevronLeft className="h-4 w-4" />
//             Back to Dashboard
//           </Button>
//         </div>
//         <div>
//           <div className="h-8 w-48 bg-muted animate-pulse rounded-md"></div>
//           <div className="h-4 w-64 mt-2 bg-muted animate-pulse rounded-md"></div>
//         </div>
//         <div className="grid gap-6 md:grid-cols-2">
//           <div className="h-96 bg-muted animate-pulse rounded-md"></div>
//           <div className="space-y-6">
//             <div className="h-48 bg-muted animate-pulse rounded-md"></div>
//             <div className="h-48 bg-muted animate-pulse rounded-md"></div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="container mx-auto py-6 space-y-6">
//       <div className="flex items-center gap-2">
//         <Button variant="ghost" size="sm" asChild>
//           <Link href="/dashboard/projects-manage">
//             <ChevronLeft className="h-4 w-4" />
//             Back to Dashboard
//           </Link>
//         </Button>
//       </div>

//       <div>
//         <h1 className="text-3xl font-bold tracking-tight">Edit Project</h1>
//         <p className="text-muted-foreground">Update project details and settings</p>
//       </div>

//       <form onSubmit={handleSubmit}>
//         <div className="grid gap-6 md:grid-cols-2">
//           <Card>
//             <CardHeader>
//               <CardTitle>Project Details</CardTitle>
//               <CardDescription>Update the basic information about your project</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="title">Project Title</Label>
//                 <Input
//                   id="title"
//                   name="title"
//                   value={project.title}
//                   onChange={handleInputChange}
//                   placeholder="Enter project title"
//                   required
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="description">Description</Label>
//                 <Textarea
//                   id="description"
//                   name="description"
//                   value={project.description}
//                   onChange={handleInputChange}
//                   placeholder="Describe the project"
//                   className="min-h-[120px]"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="status">Status</Label>
//                 <Select value={project.status} onValueChange={handleStatusChange}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="planning">Planning</SelectItem>
//                     <SelectItem value="in-progress">In Progress</SelectItem>
//                     <SelectItem value="on-hold">On Hold</SelectItem>
//                     <SelectItem value="completed">Completed</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="budget">Budget ($)</Label>
//                   <Input
//                     id="budget"
//                     name="budget"
//                     type="number"
//                     value={project.budget}
//                     onChange={handleInputChange}
//                     placeholder="0.00"
//                     min="0"
//                     step="0.01"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Due Date</Label>
//                   <Popover>
//                     <PopoverTrigger asChild>
//                       <Button
//                         variant={"outline"}
//                         className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
//                       >
//                         <CalendarIcon className="mr-2 h-4 w-4" />
//                         {date ? format(date, "PPP") : <span>Pick a date</span>}
//                       </Button>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-auto p-0">
//                       <Calendar mode="single" selected={date} onSelect={handleDateChange} initialFocus />
//                     </PopoverContent>
//                   </Popover>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label>Project Image</Label>
//                 <div className="flex flex-col gap-4">
//                   {project.image && (
//                     <div className="relative rounded-lg overflow-hidden border h-40">
//                       <img
//                         src={project.image || "/placeholder.svg"}
//                         alt="Project preview"
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                   )}
//                   <ImageUpload onImageUpload={handleImageUpload} />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <div className="space-y-6">
//             <Card>
//               <CardHeader>
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <CardTitle>Client Information</CardTitle>
//                     <CardDescription>Update client details or select a different client</CardDescription>
//                   </div>
//                   <Button type="button" variant="outline" size="sm" onClick={() => setIsClientDialogOpen(true)}>
//                     Change Client
//                   </Button>
//                 </div>
//               </CardHeader>
//               <CardContent>
//               <div className="space-y-2 mb-4">
//                 <Label htmlFor="client">Select Client</Label>
//                 <Select
//                   value={project.client._id}
//                   onValueChange={(value) => {
//                     const selectedClient = clients.find((client) => client._id === value);
//                     handleSelectChange("client", selectedClient);
//                   }}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select a client" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {loading ? (
//                       <SelectItem value="loading" disabled>
//                         Loading clients...
//                       </SelectItem>
//                     ) : clients.length > 0 ? (
//                       clients.map((client) => (
//                         <SelectItem key={client._id} value={client._id}>
//                           {client.name}
//                         </SelectItem>
//                       ))
//                     ) : (
//                       <SelectItem value="none" disabled>
//                         No clients available
//                       </SelectItem>
//                     )}
//                   </SelectContent>
//                 </Select>
//               </div>
//                 {project.client && project.client._id ? (
//                   <div className="flex items-center gap-4 p-4 rounded-lg border">
//                     <div className="h-16 w-16 rounded-full overflow-hidden border">
//                       <img
//                         src={project.client.image || "/placeholder.svg?height=64&width=64"}
//                         alt={project.client.name}
//                         className="h-full w-full object-cover"
//                       />
//                     </div>
//                     <div>
//                       <h3 className="font-medium">{project.client.name}</h3>
//                       <p className="text-sm text-muted-foreground">{project.client.email}</p>
//                       <p className="text-sm text-muted-foreground">{project.client.phone}</p>
//                     </div>
//                     <Button
//                       type="button"
//                       variant="outline"
//                       size="sm"
//                       onClick={() => setIsClientDialogOpen(true)}
//                     >
//                       Update Client
//                     </Button>
//                   </div>
//                 ) : (
//                   <div className="flex flex-col items-center justify-center h-24 border border-dashed rounded-md p-4 text-muted-foreground">
//                     <p className="text-sm">No client selected</p>
//                     <Button variant="ghost" size="sm" className="mt-2" onClick={() => setIsClientDialogOpen(true)}>
//                       Select Client
//                     </Button>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>Additional Information</CardTitle>
//                 <CardDescription>Update notes and comments about the project</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <Tabs defaultValue="notes">
//                   <TabsList className="grid w-full grid-cols-2">
//                     <TabsTrigger value="notes">Notes</TabsTrigger>
//                     <TabsTrigger value="comments">Comments</TabsTrigger>
//                   </TabsList>
//                   <TabsContent value="notes" className="space-y-4 pt-4">
//                     <Textarea
//                       name="notes"
//                       value={project.notes || ""}
//                       onChange={handleInputChange}
//                       placeholder="Add private notes about this project"
//                       className="min-h-[150px]"
//                     />
//                   </TabsContent>
//                   <TabsContent value="comments" className="space-y-4 pt-4">
//                     <Textarea
//                       name="comments"
//                       value={project.comments || ""}
//                       onChange={handleInputChange}
//                       placeholder="Add comments that will be visible to the team"
//                       className="min-h-[150px]"
//                     />
//                   </TabsContent>
//                 </Tabs>
//               </CardContent>
//             </Card>
//           </div>
//         </div>

//         <div className="flex justify-end gap-4 mt-6">
//           <Button type="button" variant="outline" onClick={() => router.push("/dashboard/projects-manage")}>
//             Cancel
//           </Button>
//           <Button type="submit" disabled={isSubmitting}>
//             {isSubmitting ? "Saving..." : "Save Changes"}
//           </Button>
//           <Button
//             type="button"
//             variant="outline"
//             onClick={() => router.push(`/dashboard/projects-manage/${params.id}/kanban`)}
//           >
//             Open Kanban Board
//           </Button>
//         </div>

//         <AddClientDialog
//           open={isClientDialogOpen}
//           onOpenChange={setIsClientDialogOpen}
//           clients={clients}
//           onClientSelected={handleClientChange}
//         />
//       </form>
//     </div>
//   )
// }


"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, CalendarIcon } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { AddClientDialog } from "@/components/projects/add-client-dialog"
import ImageUpload from "@/components/ImageUpload"
import { getProject, updateProject, getClients } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function EditProject({ params }) {
  const router = useRouter()
  const { toast } = useToast()
  const [project, setProject] = useState({
    title: "",
    description: "",
    status: "planning",
    budget: 0,
    dueDate: null,
    client: {},
    notes: "",
    comments: "",
    image: "",
  })
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false)
  const [date, setDate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [clients, setClients] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Fetch project data
        const projectData = await getProject(params.id)

        // Format the date
        const dueDate = projectData.dueDate ? new Date(projectData.dueDate) : null

        setProject({
          ...projectData,
          dueDate,
        })
        setDate(dueDate)

        // Fetch clients for the client selection dialog
        const clientsData = await getClients()
        setClients(clientsData)
      } catch (error) {
        console.error("Failed to fetch project data:", error)
        toast({
          title: "Error",
          description: "Failed to load project data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id, toast])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!project.title) {
      toast({
        title: "Validation Error",
        description: "Project title is required",
        variant: "destructive",
      })
      return
    }

    if (!date) {
      toast({
        title: "Validation Error",
        description: "Due date is required",
        variant: "destructive",
      })
      return
    }

    if (!project.client || !project.client._id) {
      toast({
        title: "Validation Error",
        description: "Please select a client",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      // Prepare the data for submission
      const updatedProject = {
        ...project,
        dueDate: date.toISOString(),
        budget: Number(project.budget),
      }

      // Update the project
      await updateProject(params.id, updatedProject)

      toast({
        title: "Success",
        description: "Project updated successfully",
      })

      // Redirect to projects list
      router.push("/dashboard/projects-manage")
    } catch (error) {
      console.error("Failed to update project:", error)
      toast({
        title: "Error",
        description: "Failed to update project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProject((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageUpload = (imageUrl) => {
    setProject((prev) => ({
      ...prev,
      image: imageUrl,
    }))
  }

  const handleDateChange = (newDate) => {
    setDate(newDate)
  }

  const handleStatusChange = (value) => {
    setProject((prev) => ({
      ...prev,
      status: value,
    }))
  }

  const handleClientChange = (newClient) => {
    if (newClient && newClient._id) {
      setProject((prev) => ({
        ...prev,
        client: newClient,
      }))
      toast({
        title: "Client Updated",
        description: `Client changed to ${newClient.name}`,
      })
    }
    setIsClientDialogOpen(false)
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" disabled>
            <ChevronLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
        <div>
          <div className="h-8 w-48 bg-muted animate-pulse rounded-md"></div>
          <div className="h-4 w-64 mt-2 bg-muted animate-pulse rounded-md"></div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-96 bg-muted animate-pulse rounded-md"></div>
          <div className="space-y-6">
            <div className="h-48 bg-muted animate-pulse rounded-md"></div>
            <div className="h-48 bg-muted animate-pulse rounded-md"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/projects-manage">
            <ChevronLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Project</h1>
        <p className="text-muted-foreground">Update project details and settings</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>Update the basic information about your project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={project.title}
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
                  value={project.description}
                  onChange={handleInputChange}
                  placeholder="Describe the project"
                  className="min-h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={project.status} onValueChange={handleStatusChange}>
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
                    value={project.budget}
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
                        className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={date} onSelect={handleDateChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Project Image</Label>
                <div className="flex flex-col gap-4">
                  {project.image && (
                    <div className="relative rounded-lg overflow-hidden border h-40">
                      <img
                        src={project.image || "/placeholder.svg"}
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
                    <CardDescription>Update client details or select a different client</CardDescription>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => setIsClientDialogOpen(true)}>
                    Change Client
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  
                  {project.client && project.client._id ? (
                    <div className="mt-4 flex items-center gap-4 p-4 rounded-lg border">
                      <div className="h-16 w-16 rounded-full overflow-hidden border">
                        <img
                          src={project.client.image || "/placeholder.svg?height=64&width=64"}
                          alt={project.client.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{project.client.name}</h3>
                        <p className="text-sm text-muted-foreground">{project.client.email}</p>
                        {project.client.phone && (
                          <p className="text-sm text-muted-foreground">{project.client.phone}</p>
                        )}
                      </div>
                      <Button type="button" variant="outline" size="sm" onClick={() => setIsClientDialogOpen(true)}>
                        Change
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-24 border border-dashed rounded-md p-4 text-muted-foreground">
                      <p className="text-sm">No client selected</p>
                      <Button variant="ghost" size="sm" className="mt-2" onClick={() => setIsClientDialogOpen(true)}>
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
                <CardDescription>Update notes and comments about the project</CardDescription>
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
                      value={project.notes || ""}
                      onChange={handleInputChange}
                      placeholder="Add private notes about this project"
                      className="min-h-[150px]"
                    />
                  </TabsContent>
                  <TabsContent value="comments" className="space-y-4 pt-4">
                    <Textarea
                      name="comments"
                      value={project.comments || ""}
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
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard/projects-manage")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/dashboard/projects-manage/${params.id}/kanban`)}
          >
            Open Kanban Board
          </Button>
        </div>

        <AddClientDialog
          open={isClientDialogOpen}
          onOpenChange={setIsClientDialogOpen}
          clients={clients}
          onClientSelected={handleClientChange}
        />
      </form>
    </div>
  )
}

