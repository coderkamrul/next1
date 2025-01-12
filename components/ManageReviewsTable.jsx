'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
import { Star } from 'lucide-react'

export default function ManageReviewsTable() {
  const [reviews, setReviews] = useState([])
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const router = useRouter()

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    const res = await fetch('/api/reviews')
    const data = await res.json()
    if (data.success) {
      setReviews(data.data)
    }
  }

  const columns = [
    {
      accessorKey: 'profilePicture',
      header: 'Profile Picture',
      cell: ({ row }) =>
        row.getValue('profilePicture') ? (
          <Image
            src={row.getValue('profilePicture')}
            alt={row.getValue('name')}
            width={50}
            height={50}
          />
        ) : (
          <div className='rounded-full w-10 h-10 flex items-center justify-center bg-gray-200'>
            {row.getValue('name').charAt(0).toUpperCase()}
          </div>
        ),
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className='capitalize'>{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'review',
      header: 'Review',
      cell: ({ row }) => (
        <div className='truncate max-w-[400px]'>{row.getValue('review')}</div>
      ),
    },
    {
      accessorKey: 'rating',
      header: 'Rating',
      cell: ({ row }) => {
        const stars = row.getValue('rating')
        return (
          <div className='flex items-center gap-1'>
            <span>{row.getValue('rating')}</span>
            <Star className='h-4 w-4 text-yellow-500 fill-current' />
          </div>
        )
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      accessorKey: '_id',
      header: 'Actions',
      cell: ({ row }) => {
        const review = row.original
        return (
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() =>
                router.push(`/dashboard/reviews/edit/${review._id}`)
              }
            >
              Edit
            </Button>
            <Button
              variant='destructive'
              size='sm'
              onClick={() => handleDelete(review._id)}
            >
              Delete
            </Button>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data: reviews,
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
    if (confirm('Are you sure you want to delete this review?')) {
      const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        fetchReviews()
        toast({
          title: 'Review deleted',
          description: 'The review has been deleted successfully.',
        })
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete review. Please try again.',
          variant: 'destructive',
        })
      }
    }
  }

  return (
    <>
      <div className='flex items-center py-4'>
        <Input
          placeholder='Filter reviews...'
          value={table.getColumn('name')?.getFilterValue() ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
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
                    <TableCell key={cell.id}>
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
    </>
  )
}
