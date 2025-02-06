// 'use client'

// import { useEffect, useState, useMemo } from 'react'
// import {
//   flexRender,
//   getCoreRowModel,
//   useReactTable,
//   getPaginationRowModel,
//   getSortedRowModel,
//   getFilteredRowModel,
// } from '@tanstack/react-table'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
// import { toast } from '@/hooks/use-toast'
// import Link from 'next/link'
// import axios from 'axios'

// const ManageSubscribersTable = () => {
//   const [subscribers, setSubscribers] = useState([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [sorting, setSorting] = useState([])
//   const [pagination, setPagination] = useState({
//     pageIndex: 0,
//     pageSize: 10,
//   })
//   const [filtering, setFiltering] = useState([])

//   const columns = useMemo(
//     () => [
//       {
//         accessorKey: 'name',
//         header: 'Name',
//         enableSorting: true,
//         cell: (info) => info.getValue(),
//       },
//       {
//         accessorKey: 'email',
//         header: 'Email',
//         enableSorting: true,
//         cell: (info) => info.getValue(),
//       },
//       {
//         id: 'actions',
//         header: 'Actions',
//         enableHiding: false,
//         cell: ({ row }) => (
//           <div className="flex gap-2">
//             <Link href={`/dashboard/subscriber/edit/${row.original._id}`}>
//               <Button variant="outline" size="sm">
//                 Edit
//               </Button>
//             </Link>
//             <Button
//               variant="outline"
//               size="sm"
//               color="red"
//               onClick={() => handleDelete(row.original._id)}
//             >
//               Delete
//             </Button>
//           </div>
//         ),
//       },
//     ],
//     []
//   )

//   const handleDelete = (id) => {
//     axios.delete(`/api/subscriber/${id}`).then(() => {
//       toast({ description: 'Subscriber deleted successfully.' })
//       setSubscribers((prevSubscribers) =>
//         prevSubscribers.filter((sub) => sub._id !== id)
//       )
//     })
//   }

//   const table = useReactTable({
//     data: subscribers,
//     columns,
//     state: {
//       sorting,
//       pagination,
//       filtering,
//     },
//     onSortingChange: setSorting,
//     onPaginationChange: setPagination,
//     onFilterChange: setFiltering,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//   })

//   useEffect(() => {
//     axios.get('/api/subscriber').then((res) => {
//       if (res.data.success) {
//         setSubscribers(res.data.data)
//       } else {
//         toast({ description: 'Failed to fetch subscribers.' })
//       }
//       setIsLoading(false)
//     })
//   }, [])

//   return (
//     <div>
//       <h1 className="text-3xl font-bold">Manage Subscribers</h1>
//       {isLoading ? (
//         <p>Loading...</p>
//       ) : (
//         <Table>
//           <TableHead>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => (
//                   <TableHeader key={header.id} colSpan={header.colSpan}>
//                     {header.isPlaceholder ? null : (
//                       <div className="flex items-center gap-2">
//                         {flexRender(
//                           header.column.columnDef.header,
//                           header.getContext()
//                         )}
//                         {header.column.getCanSort() && (
//                           <span
//                             className={
//                               header.column.getIsSorted()
//                                 ? 'text-primary-500'
//                                 : 'text-neutral-400'
//                             }
//                           >
//                             {header.column.getIsSorted() ? (
//                               <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 className="h-4 w-4"
//                                 fill="none"
//                                 viewBox="0 0 24 24"
//                                 stroke="currentColor"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M3 4h13M3 8h9m-9 4h9m5-4a9 9 0 0118 0 9 9 0 0118 0z"
//                                 />
//                               </svg>
//                             ) : (
//                               <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 className="h-4 w-4"
//                                 fill="none"
//                                 viewBox="0 0 24 24"
//                                 stroke="currentColor"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M7 4v16M17 4v16M3 8h16M3 16h16"
//                                 />
//                               </svg>
//                             )}
//                           </span>
//                         )}
//                       </div>
//                     )}
//                   </TableHeader>
//                 ))}
//               </TableRow>
//             ))}
//           </TableHead>
//           <TableBody>
//             {table.getRowModel().rows.map((row) => (
//               <TableRow key={row.index}>
//                 {row.getVisibleCells().map((cell) => (
//                   <TableCell key={cell.id}>
//                     {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       )}
//     </div>
//   )
// }

// export default ManageSubscribersTable


"use client"

import { useState, useEffect } from "react"
import { toast } from "@/hooks/use-toast"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

const columns = ({ onEdit, onDelete }) => [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const subscriber = row.original

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
            <DropdownMenuItem onClick={() => onEdit(subscriber)}>Edit</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onDelete(subscriber)}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

function DataTable({ columns, data }) {
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [globalFilter, setGlobalFilter] = useState("")

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  })

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter subscribers..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(String(event.target.value))}
          className="max-w-sm"
        />
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
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>
  )
}

function EditSubscriberDialog({ subscriber, onClose, onSave }) {
  const [editedSubscriber, setEditedSubscriber] = useState(subscriber || { name: "", email: "" })

  useEffect(() => {
    if (subscriber) {
      setEditedSubscriber(subscriber)
    }
  }, [subscriber])

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditedSubscriber((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(editedSubscriber)
  }

  if (!subscriber) return null

  return (
    <Dialog open={!!subscriber} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Subscriber</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="name" placeholder="Name" value={editedSubscriber.name} onChange={handleChange} />
          <Input name="email" type="email" placeholder="Email" value={editedSubscriber.email} onChange={handleChange} />
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function DeleteSubscriberDialog({ subscriber, onClose, onDelete }) {
  if (!subscriber) return null

  return (
    <Dialog open={!!subscriber} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete the subscriber {subscriber.name}?</p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function page() {
  const [subscribers, setSubscribers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingSubscriber, setEditingSubscriber] = useState(null)
  const [deletingSubscriber, setDeletingSubscriber] = useState(null)

  useEffect(() => {
    fetchSubscribers()
  }, [])

  const fetchSubscribers = async () => {
    try {
      const response = await axios.get("/api/subscriber")
      if (response.data.success) {
        setSubscribers(response.data.data)
      } else {
        toast({ description: "Failed to fetch subscribers.", variant: "destructive" })
      }
    } catch (error) {
      console.error("Error fetching subscribers:", error)
      toast({ description: "An error occurred while fetching subscribers.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = async (updatedSubscriber) => {
    try {
      const { data } = await axios.put(`/api/subscriber/${updatedSubscriber._id}`, updatedSubscriber)
      setSubscribers((prevSubscribers) => prevSubscribers.map((sub) => (sub._id === data.data._id ? data.data : sub)))
      toast({ description: "Subscriber updated successfully.", variant: "success" })
      setEditingSubscriber(null)
    } catch (error) {
      console.error("Error updating subscriber:", error)
      toast({ description: "Failed to update subscriber.", variant: "destructive" })
    }
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/subscriber/${deletingSubscriber._id}`)
      setSubscribers((prevSubscribers) => prevSubscribers.filter((sub) => sub._id !== deletingSubscriber._id))
      toast({ description: "Subscriber deleted successfully.", variant: "success" })
      setDeletingSubscriber(null)
    } catch (error) {
      console.error("Error deleting subscriber:", error)
      toast({ description: "Failed to delete subscriber.", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Manage Subscribers</h1>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <DataTable
          columns={columns({ onEdit: setEditingSubscriber, onDelete: setDeletingSubscriber })}
          data={subscribers}
        />
      )}
      <EditSubscriberDialog
        subscriber={editingSubscriber}
        onClose={() => setEditingSubscriber(null)}
        onSave={handleEdit}
      />
      <DeleteSubscriberDialog
        subscriber={deletingSubscriber}
        onClose={() => setDeletingSubscriber(null)}
        onDelete={handleDelete}
      />
    </div>
  )
}

