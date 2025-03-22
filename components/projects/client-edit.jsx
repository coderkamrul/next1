"use client"

import { useState, useEffect } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getClients } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ImageUpload from "@/components/ImageUpload"

export function ClientEdit({
  open,
  onOpenChange,
  onClientSelected,
  onClientAdded,
  clients: initialClients,
  initialTab = "select",
}) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState(initialTab)
  const [clients, setClients] = useState(initialClients || [])
  const [selectedClientId, setSelectedClientId] = useState("")
  const [clientName, setClientName] = useState("")
  const [clientEmail, setClientEmail] = useState("")
  const [clientPhone, setClientPhone] = useState("")
  const [clientImage, setClientImage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [clientId, setClientId] = useState(null)

  useEffect(() => {
    if (open && !initialClients) {
      const fetchClients = async () => {
        try {
          setIsLoading(true)
          const data = await getClients()
          setClients(data)
        } catch (error) {
          console.error("Failed to fetch clients:", error)
          toast({
            title: "Error",
            description: "Failed to load clients. Please try again.",
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
        }
      }

      fetchClients()
    }

    // If we have initialClients with one item, we're in edit mode
    if (initialClients && initialClients.length === 1) {
      const client = initialClients[0]
      setIsEditing(true)
      setClientId(client._id)
      setClientName(client.name)
      setClientEmail(client.email)
      setClientPhone(client.phone || "")
      setClientImage(client.image || null)
      setSelectedClientId(client._id)
    } else {
      // Reset form when opening in add mode
      if (open && !isEditing) {
        setClientName("")
        setClientEmail("")
        setClientPhone("")
        setClientImage(null)
        setClientId(null)
      }
    }
  }, [open, initialClients, toast, isEditing])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!clientName || !clientEmail) {
      toast({
        title: "Validation Error",
        description: "Name and email are required",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const clientData = {
        name: clientName,
        email: clientEmail,
        phone: clientPhone,
        image: clientImage,
      }

      // If editing, include the ID
      if (isEditing && clientId) {
        clientData._id = clientId
      }

      // Call the callback with the client data
      if (onClientAdded) {
        onClientAdded(clientData)
      }

      // Reset form
      if (!isEditing) {
        setClientName("")
        setClientEmail("")
        setClientPhone("")
        setClientImage(null)
      }

      // Close dialog if not handled by parent
      if (!onClientAdded) {
        onOpenChange(false)
      }
    } catch (error) {
      console.error("Failed to handle client:", error)
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} client. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSelectClient = () => {
    if (!selectedClientId) {
      toast({
        title: "Validation Error",
        description: "Please select a client",
        variant: "destructive",
      })
      return
    }

    const selectedClient = clients.find((client) => client._id === selectedClientId)

    if (selectedClient && onClientSelected) {
      onClientSelected(selectedClient)
      toast({
        title: "Client Selected",
        description: `${selectedClient.name} has been selected`,
      })
    }

    onOpenChange(false)
  }

  const handleImageUpload = (imageUrl) => {
    setClientImage(imageUrl)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Client" : "Client Selection"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update client information" : "Select an existing client or add a new one"}
          </DialogDescription>
        </DialogHeader>

        {isEditing ? (
          // Edit mode - just show the form
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col items-center gap-2 mb-2">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={clientImage || ""} />
                  <AvatarFallback>{clientName ? clientName.charAt(0).toUpperCase() : "C"}</AvatarFallback>
                </Avatar>
                <ImageUpload onImageUpload={handleImageUpload} />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="client-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="client-name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="client-email" className="text-right">
                  Email
                </Label>
                <Input
                  id="client-email"
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="client-phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="client-phone"
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Client"}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          // Add/Select mode - show tabs
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="select">Select Client</TabsTrigger>
              <TabsTrigger value="create">Create New</TabsTrigger>
            </TabsList>

            <TabsContent value="select" className="space-y-4 py-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : clients.length > 0 ? (
                <RadioGroup value={selectedClientId} onValueChange={setSelectedClientId}>
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                    {clients.map((client) => (
                      <div key={client._id} className="flex items-center space-x-2 border rounded-md p-3">
                        <RadioGroupItem value={client._id} id={`client-${client._id}`} />
                        <div className="flex items-center gap-3 flex-1">
                          <Avatar>
                            <AvatarImage src={client.image} />
                            <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <Label htmlFor={`client-${client._id}`} className="font-medium cursor-pointer">
                              {client.name}
                            </Label>
                            <p className="text-sm text-muted-foreground">{client.email}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No clients found. Create a new one.</p>
                  <Button variant="ghost" onClick={() => setActiveTab("create")} className="mt-2">
                    Create New Client
                  </Button>
                </div>
              )}

              <DialogFooter>
                <Button type="button" onClick={handleSelectClient} disabled={!selectedClientId}>
                  Select Client
                </Button>
              </DialogFooter>
            </TabsContent>

            <TabsContent value="create">
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="flex flex-col items-center gap-2 mb-2">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={clientImage || ""} />
                      <AvatarFallback>{clientName ? clientName.charAt(0).toUpperCase() : "C"}</AvatarFallback>
                    </Avatar>
                    <ImageUpload onImageUpload={handleImageUpload} />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="client-name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="client-name"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="client-email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="client-email"
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="client-phone" className="text-right">
                      Phone
                    </Label>
                    <Input
                      id="client-phone"
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setActiveTab("select")}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Save Client"}
                  </Button>
                </DialogFooter>
              </form>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  )
}

