"use client"

import { useState, useEffect } from "react"
import { PlusCircle, Pencil, Trash2, UserIcon } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getClients, deleteClient, updateClient } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { ClientEdit } from "./client-edit"

export function ClientSheet() {
  const [open, setOpen] = useState(false)
  const [clients, setClients] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedClientId, setSelectedClientId] = useState(null)
  const [addClientOpen, setAddClientOpen] = useState(false)
  const [editClientOpen, setEditClientOpen] = useState(false)
  const [currentClient, setCurrentClient] = useState(null)
  const { toast } = useToast()

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

  useEffect(() => {
    if (open) {
      fetchClients()
    }
  }, [open])

  const handleDelete = (id) => {
    setSelectedClientId(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (selectedClientId) {
      try {
        await deleteClient(selectedClientId)
        setClients(clients.filter((client) => client._id !== selectedClientId))
        toast({
          title: "Client deleted",
          description: "Client has been deleted successfully",
        })
      } catch (error) {
        console.error("Failed to delete client:", error)
        toast({
          title: "Error",
          description: "Failed to delete client. Please try again.",
          variant: "destructive",
        })
      } finally {
        setDeleteDialogOpen(false)
        setSelectedClientId(null)
      }
    }
  }

  const handleEdit = (client) => {
    setCurrentClient(client)
    setEditClientOpen(true)
  }

  const handleClientAdded = (newClient) => {
    setClients((prev) => [...prev, newClient])
    setAddClientOpen(false)
    toast({
      title: "Success",
      description: "Client added successfully",
    })
  }

  const handleClientUpdated = async (updatedClient) => {
    try {
      const result = await updateClient(updatedClient._id, updatedClient)
      setClients(clients.map((client) => (client._id === updatedClient._id ? result : client)))
      setEditClientOpen(false)
      toast({
        title: "Success",
        description: "Client updated successfully",
      })
    } catch (error) {
      console.error("Failed to update client:", error)
      toast({
        title: "Error",
        description: "Failed to update client. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline">
        <UserIcon className="mr-2 h-4 w-4" /> Clients
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="sm:max-w-md md:max-w-lg lg:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Clients Management</SheetTitle>
            <SheetDescription>View, add, edit, or delete your clients.</SheetDescription>
          </SheetHeader>

          <div className="flex justify-between items-center my-4">
            <h3 className="text-lg font-medium">Client List</h3>
            <Button onClick={() => setAddClientOpen(true)} size="sm">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Client
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead className="hidden md:table-cell">Phone</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.length > 0 ? (
                    clients.map((client) => (
                      <TableRow key={client._id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={client.image} />
                              <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{client.name}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{client.email}</TableCell>
                        <TableCell className="hidden md:table-cell">{client.phone || "-"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(client)}>
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(client._id)}>
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                        No clients found. Add a new client to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this client? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Use the provided ClientEdit for adding new clients */}
      <ClientEdit open={addClientOpen} onOpenChange={setAddClientOpen} onClientAdded={handleClientAdded} />

      {/* Use the same ClientEdit for editing, but with the current client data */}
      {currentClient && (
        <ClientEdit
          open={editClientOpen}
          onOpenChange={setEditClientOpen}
          onClientAdded={handleClientUpdated}
          clients={[currentClient]} // Pre-select this client
          initialTab="create" // Start in edit mode
        />
      )}
    </>
  )
}

