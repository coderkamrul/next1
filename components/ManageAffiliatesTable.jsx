'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from '@/hooks/use-toast'
import Image from 'next/image'
import axios from 'axios'
import {
  DialogTitle,
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import EditAffiliateForm from './EditAffiliateForm'
import { Copy } from 'lucide-react'
import { IoCheckmark } from 'react-icons/io5'

export default function ManageAffiliatesTable({ affiliates, fetchAffiliates }) {
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [selectedAffiliate, setSelectedAffiliate] = useState(null)
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false)

  const columns = [
    {
      accessorKey: 'affiliateImage',
      header: 'Image',
      cell: ({ row }) => (
        <Image
          src={row.getValue('affiliateImage')}
          alt={row.getValue('affiliateName')}
          width={50}
          height={50}
        />
      ),
    },
    {
      accessorKey: 'affiliateName',
      header: 'Name',
      cell: ({ row }) => (
        <div className='capitalize'>{row.getValue('affiliateName')}</div>
      ),
    },
    {
      accessorKey: 'affiliateCategory',
      header: 'Category',
      cell: ({ row }) => (
        <div className='capitalize'>{row.getValue('affiliateCategory')}</div>
      ),
    },
    {
      accessorKey: 'affiliateLink',
      header: 'Link',
      cell: ({ row }) => (
        <div className='flex items-center justify-between border-dashed border rounded p-1 px-2 '>
          <a
            href={row.getValue('affiliateLink')}
            target='_blank'
            rel='noopener noreferrer'
            className='text-sm mr-2 hover:underline'
          >
            {row.getValue('affiliateLink').length > 20
              ? `${row.getValue('affiliateLink').slice(0, 20)}...`
              : row.getValue('affiliateLink')}
          </a>
          <Button
            size='sm'
            variant='outline'
            onClick={() => {
              navigator.clipboard.writeText(row.getValue('affiliateLink'))

              toast({
                title: 'Copied to clipboard',
                description:
                  row.getValue('affiliateLink').length > 50
                    ? `${row.getValue('affiliateLink').slice(0, 50)}...`
                    : row.getValue('affiliateLink'),
              })
            }}
          >
            <Copy className='h-4 w-4' />
          </Button>
        </div>
      ),
    },
    {
      id: 'actions',
      enableHiding: false,
      accessorKey: '_id',
      header: 'Actions',
      cell: ({ row }) => {
        const affiliate = row.original
        return (
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => handleEdit(affiliate)}
            >
              Edit
            </Button>
            <Button
              variant='destructive'
              size='sm'
              onClick={() => handleDelete(affiliate._id)}
            >
              Delete
            </Button>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data: affiliates,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  const handleDelete = async (id) => {
    setIsOpenDeleteDialog(true)
    const affiliate = affiliates.find((affiliate) => affiliate._id === id)
    setSelectedAffiliate(affiliate)
  }

  const handleConfirmDelete = async () => {
    setIsOpenDeleteDialog(false)
    const res = await axios.delete(`/api/affiliates/${selectedAffiliate._id}`)
    const data = res.data
    if (data.success) {
      fetchAffiliates()
      toast({
        title: 'Affiliate deleted',
        description: 'The affiliate has been deleted successfully.',
      })
    } else {
      toast({
        title: 'Error',
        description: 'Failed to delete affiliate. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleEdit = (affiliate) => {
    setSelectedAffiliate(affiliate)
    setIsSheetOpen(true)
  }

  return (
    <>
      <div className='flex items-center py-4'>
        <Input
          placeholder='Filter affiliates...'
          value={table.getColumn('affiliateName')?.getFilterValue() ?? ''}
          onChange={(event) =>
            table.getColumn('affiliateName')?.setFilterValue(event.target.value)
          }
          className='max-w-sm'
        />
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className='max-w-24'>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </motion.tr>
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
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Add/Edit Affiliate</SheetTitle>
          </SheetHeader>
          {selectedAffiliate && (
            <EditAffiliateForm
              affiliate={selectedAffiliate}
              onClose={() => {
                setIsSheetOpen(false)
                fetchAffiliates()
              }}
            />
          )}
        </SheetContent>
      </Sheet>
      <Dialog open={isOpenDeleteDialog} onOpenChange={setIsOpenDeleteDialog}>
        <DialogContent className='space-y-4'>
          <DialogTitle className='text-xl'>Confirm Delete</DialogTitle>
          <p>Are you sure you want to delete this affiliate?</p>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setIsOpenDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant='destructive'
              size='sm'
              onClick={handleConfirmDelete}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
