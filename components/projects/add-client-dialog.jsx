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
import { createClient, getClients } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ImageUpload from "@/components/ImageUpload"

export function AddClientDialog({ open, onOpenChange, onClientSelected, onClientAdded, clients: initialClients }) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("select")
  const [clients, setClients] = useState(initialClients || [])
  const [selectedClientId, setSelectedClientId] = useState("")
  const [clientName, setClientName] = useState("")
  const [clientEmail, setClientEmail] = useState("")
  const [clientPhone, setClientPhone] = useState("")
  const [clientImage, setClientImage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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
  }, [open, initialClients, toast])

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
      const newClient = await createClient({
        name: clientName,
        email: clientEmail,
        phone: clientPhone || undefined,
        image: clientImage || undefined,
      })

      toast({
        title: "Client created",
        description: "New client has been added successfully",
      })

      // Add the new client to the list
      setClients((prev) => [...prev, newClient])

      // Select the new client
      setSelectedClientId(newClient._id)

      // Call the callback if provided
      if (onClientAdded) {
        onClientAdded(newClient)
      }

      if (onClientSelected) {
        onClientSelected(newClient)
      }

      // Reset form
      setClientName("")
      setClientEmail("")
      setClientPhone("")
      setClientImage(null)

      // Switch back to select tab
      setActiveTab("select")
    } catch (error) {
      console.error("Failed to create client:", error)
      toast({
        title: "Error",
        description: "Failed to create client. Please try again.",
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
          <DialogTitle>Client Selection</DialogTitle>
          <DialogDescription>Select an existing client or add a new one</DialogDescription>
        </DialogHeader>

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
      </DialogContent>
    </Dialog>
  )
}

