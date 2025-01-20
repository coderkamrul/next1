'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import {
  ArrowDown,
  ArrowUp,
  Delete,
  Eye,
  SortAsc,
  SortDesc,
  Mail,
  Paperclip,
  Send,
  Trash,
} from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetTrigger,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'

const columns = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('name')}</div>,
    enableSorting: true,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => <div className='lowercase'>{row.getValue('email')}</div>,
    enableSorting: true,
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
    enableSorting: true,
  },
  {
    id: 'actions',
    header: 'Actions',
    enableHiding: false,
    cell: ({ row, table }) => {
      const submission = row.original
      const { toast } = useToast()

      const handleDelete = (id) => {
<<<<<<< HEAD
        axios.delete(`/api/submissions/${id}`).then(() => {
          toast({ description: 'Submission deleted successfully.' })
          table.options.meta.setSubmissions((prevSubmissions) =>
            prevSubmissions.filter((sub) => sub._id !== id)
          )
          DialogClose()
        })
=======
        axios
          .delete(`/api/submissions/${id}`)
          .then(() => {
            toast({ description: 'Submission deleted successfully.' })
            table.options.meta.setSubmissions((prevSubmissions) =>
              prevSubmissions.filter((sub) => sub._id !== id)
            )
            DialogClose()
          })
>>>>>>> origin/main
      }

      const [subject, setSubject] = useState('')
      const [message, setMessage] = useState('')
      const [emails, setEmails] = useState([])

      const fetchEmails = async () => {
        try {
          const { data } = await axios.get(`/api/email/${submission._id}`)

          setEmails(data)
        } catch (error) {
          console.error('Failed to get emails:', error)
          return { error: 'Failed to get emails' }
        }
      }

      const handleSendEmail = () => {
        axios
          .post('/api/email', {
            to: submission.email,
            subject,
            message,
            submissionId: submission._id,
          })
          .then(() => {
            toast({ description: 'Email sent successfully.' })
            fetchEmails()
            setSubject('')
            setMessage('')
          })
          .catch((error) => {
            toast({
              description: 'Failed to send email.',
              variant: 'destructive',
            })
          })
      }

      const handleDeleteEmail = (id) => {
        axios
          .delete(`/api/email/${id}`)
          .then(() => {
            toast({ description: 'Email deleted successfully.' })
            fetchEmails()
          })
          .catch((error) => {
            toast({
              description: 'Failed to delete email.',
              variant: 'destructive',
            })
          })
      }

      return (
        <div>
          {' '}
          <Sheet>
            <SheetTrigger onClick={() => fetchEmails()} asChild>
              <Button variant='outline' size='sm' className='mr-2'>
                <Eye className='h-4 w-4' />
              </Button>
            </SheetTrigger>
            <SheetContent side='right' className='w-[600px] sm:w-[700px]'>
              <SheetHeader>
                <SheetTitle>New Message</SheetTitle>
              </SheetHeader>
              <div className='space-y-4 py-4'>
                <div className='flex items-center space-x-4'>
                  <Avatar>
                    <AvatarImage
                      src={`https://api.dicebear.com/6.x/initials/svg?seed=${submission.name}`}
                    />
                    <AvatarFallback>{submission.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className='text-sm font-semibold'>{submission.name}</h4>
                    <p className='text-sm text-gray-500'>{submission.email}</p>
                  </div>
                </div>
                <div className='bg-gray-50 dark:bg-gray-800 rounded-md p-4 space-y-2 flex justify-between items-start'>
                  <div>
                    <h5 className='text-sm font-semibold'>
                      Submission Message
                    </h5>
                    <p className='text-sm text-gray-600 mt-1 dark:text-gray-300'>
                      {submission.message}
                    </p>
                  </div>
                  <div className='text-sm text-gray-500'>
                    <p>Phone: {submission.phone}</p>
                  </div>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='subject'>Subject</Label>
                  <Input
                    id='subject'
                    placeholder='Enter email subject'
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='message'>Message</Label>
                  <Textarea
                    id='message'
                    placeholder='Type your message here'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={8}
                    className='resize-none'
                  />
                </div>
              </div>
              <SheetFooter>
                <div className='flex justify-end gap-2 items-center'>
                  <SheetClose asChild>
                    <Button variant='outline' size='lg'>
                      Cancel
                    </Button>
                  </SheetClose>
                  <Button onClick={handleSendEmail}>
                    <Send className='h-4 w-4 mr-2' />
                    Send Email
                  </Button>
                </div>
              </SheetFooter>
              <ScrollArea className='space-y-2 max-h-[300px] h-full'>
                <h5 className='text-sm font-semibold'>Previous Messages</h5>
                <div className='space-y-2'>
                  {emails.map((email) => (
                    <div
                      key={email._id}
                      className='bg-gray-50 dark:bg-gray-800 w-full p-4 rounded-md flex items-start justify-between relative'
                    >
                      <div className='flex items-start justify-between space-x-2 w-full'>
                        <div className='space-y-1 w-full'>
                          <div className='flex justify-between items-center w-full'>
                            <p className='text-sm font-semibold text-gray-600 dark:text-gray-300'>
                              {email.from}
                            </p>
                            <p className='text-sm text-gray-500 self-end'>
                              {new Intl.DateTimeFormat(undefined, {
                                year: 'numeric',
                                month: 'numeric',
                                day: 'numeric',
                              }).format(new Date(email.createdAt))}{' '}
                              -
                              {new Intl.DateTimeFormat(undefined, {
                                hour: '2-digit',
                                minute: '2-digit',
                              }).format(new Date(email.createdAt))}
                            </p>
                          </div>
                          <Badge
                            variant='secondary'
                            className='text-base whitespace-pre-wrap flex-col items-start'
                          >
                            <p className='text-sm font-semibold text-blue-600 dark:text-gray-300'>
                              Sub: {email.subject}
                            </p>
                            {email.text}
                          </Badge>
                        </div>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant='destructive'
                            size='sm'
                            className='absolute bottom-2 right-2 flex items-center'
                          >
                            <Trash className='h-4 w-4' />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Confirm Deletion</DialogTitle>
                          </DialogHeader>
                          <DialogDescription>
                            Are you sure you want to delete this email?
                          </DialogDescription>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant='outline' size='sm'>
                                Cancel
                              </Button>
                            </DialogClose>
                            <Button
                              onClick={() => handleDeleteEmail(email._id)}
                              variant='destructive'
                              size='sm'
                            >
                              Delete
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant='destructive' size='sm'>
                <Delete className='h-4 w-4' />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
              </DialogHeader>
              <div className='py-4'>
                Are you sure you want to delete this submission?
              </div>
              <div className='flex justify-end space-x-2'>
                <DialogClose>
                  <Button variant='outline'>Cancel</Button>
                </DialogClose>
                <Button
                  variant='destructive'
                  onClick={() => handleDelete(submission._id)}
                >
                  Confirm
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )
    },
  },
]

export default function Page() {
  const [submissions, setSubmissions] = useState([])
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = useState({})

  const { toast } = useToast()

  useEffect(() => {
    axios.get('/api/submissions').then((response) => {
      setSubmissions(response.data.data)
    })
  }, [])

  const table = useReactTable({
    data: submissions,
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
    meta: {
      setSubmissions,
    },
  })

  return (
    <div className='w-full my-10'>
      <h1 className='text-2xl font-semibold tracking-tight'>
        Manage Submissions
      </h1>
      <div className='flex items-center py-4'>
        <Input
          placeholder='Filter by name or email...'
          value={table.getColumn('name')?.getFilterValue() ?? ''}
          onChange={(event) => {
            table.getColumn('name')?.setFilterValue(event.target.value)
            table.getColumn('email')?.setFilterValue(event.target.value)
          }}
          className='max-w-sm'
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='ml-auto'>
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            {table
              .getAllLeafColumns()
              .filter((column) => !['actions', 'name'].includes(column.id))
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className='capitalize'
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className='cursor-pointer select-none'
                    >
                      <div className='flex  items-center gap-2'>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        {{
                          asc: <SortAsc size={15} />,
                          desc: <SortDesc size={15} />,
                        }[header.column.getIsSorted()] ?? null}
                      </div>
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-end space-x-2 py-4'>
        <div className='flex-1 text-sm text-muted-foreground'>
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className='space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
