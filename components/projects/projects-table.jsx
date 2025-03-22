"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { MoreHorizontal, ArrowUpDown, ChevronDown, Eye, Pencil, Trash2, KanbanSquare } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { getProjects, deleteProject } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

// Status badge component
function StatusBadge({ status }) {
  const statusMap = {
    planning: { label: "Planning", variant: "secondary" },
    "in-progress": { label: "In Progress", variant: "default" },
    "on-hold": { label: "On Hold", variant: "outline" },
    completed: { label: "Completed", variant: "success" },
  }

  const { label, variant } = statusMap[status] || { label: status, variant: "outline" }

  return <Badge variant={variant}>{label}</Badge>
}

// Progress bar component
function ProgressBar({ progress }) {
  return (
    <div className="w-full bg-muted rounded-full h-2.5">
      <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
    </div>
  )
}

export function ProjectsTable() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = useState({})
  const [statusFilter, setStatusFilter] = useState([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/project")
        if (!response.ok) {
          throw new Error("Failed to fetch projects")
        }
        const data = await response.json()
        setProjects(data)
      } catch (error) {
        console.error("Failed to fetch projects:", error)
        toast({
          title: "Error",
          description: "Failed to load projects. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [toast])

  // Column definitions
  const columns = [
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Project
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const project = row.original
        return <div className="font-medium"><Link href={`/dashboard/projects-manage/${project._id}`}>{row.getValue("title")}</Link></div>
      },
    },
    {
      accessorKey: "client", 
      header: "Client",
      cell: ({ row }) => {
        const client = row.getValue("client")
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={client.image} alt={client.name} />  
              <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{client.name}</div>
              <div className="text-xs text-muted-foreground">{client.email}</div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "budget",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Budget
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("budget"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount)

        return <div className="font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "progress",
      header: "Progress",
      cell: ({ row }) => {
        const progress = Number.parseInt(row.getValue("progress"))
        return (
          <div className="flex items-center gap-2">
            <ProgressBar progress={progress} />
            <span className="text-xs font-medium">{progress}%</span>
          </div>
        )
      },
    },
    {
      accessorKey: "dueDate",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Due Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue("dueDate"))
        return <div>{date.toLocaleDateString()}</div>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const project = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/projects-manage/${project._id}`} className="cursor-pointer flex items-center">
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/projects-manage/${project._id}/edit`} className="cursor-pointer flex items-center">
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Project
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/projects-manage/${project._id}/kanban`} className="cursor-pointer flex items-center">
                  <KanbanSquare className="mr-2 h-4 w-4" />
                  Kanban Board
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive flex items-center cursor-pointer"
                onClick={() => {
                  setProjectToDelete(project._id)
                  setDeleteDialogOpen(true)
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: projects,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  // Update status filter
  const handleStatusFilterChange = (status) => {
    setStatusFilter((prev) => {
      if (prev.includes(status)) {
        return prev.filter((s) => s !== status)
      } else {
        return [...prev, status]
      }
    })
  }

  // Apply status filter
  React.useEffect(() => {
    if (statusFilter.length > 0) {
      table.getColumn("status")?.setFilterValue(statusFilter)
    } else {
      table.getColumn("status")?.setFilterValue(undefined)
    }
  }, [statusFilter, table])

  // Handle delete project
  const handleDeleteProject = async () => {
    if (!projectToDelete) return

    try {
      const success = await deleteProject(projectToDelete)
      if (success) {
        setProjects((prev) => prev.filter((project) => project._id !== projectToDelete))
        toast({
          title: "Project deleted",
          description: "The project has been successfully deleted.",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to delete project. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to delete project:", error)
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setProjectToDelete(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between py-4">
          <div className="h-10 w-64 bg-muted animate-pulse rounded-md"></div>
          <div className="flex gap-2">
            <div className="h-10 w-24 bg-muted animate-pulse rounded-md"></div>
            <div className="h-10 w-24 bg-muted animate-pulse rounded-md"></div>
          </div>
        </div>
        <div className="rounded-md border">
          <div className="h-10 border-b bg-muted/50"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 border-b"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between py-4">
        <Input
          placeholder="Filter projects..."
          value={table.getColumn("title")?.getFilterValue() ?? ""}
          onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Status <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                checked={statusFilter.includes("planning")}
                onCheckedChange={() => handleStatusFilterChange("planning")}
              >
                Planning
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter.includes("in-progress")}
                onCheckedChange={() => handleStatusFilterChange("in-progress")}
              >
                In Progress
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter.includes("on-hold")}
                onCheckedChange={() => handleStatusFilterChange("on-hold")}
              >
                On Hold
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter.includes("completed")}
                onCheckedChange={() => handleStatusFilterChange("completed")}
              >
                Completed
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} of {table.getCoreRowModel().rows.length} project(s)
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProject}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

