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

export default function ManageYoutubeTable() {
  const [youtubes, setYoutubes] = useState([])
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const router = useRouter()

  useEffect(() => {
    fetchYoutubes()
  }, [])

  const fetchYoutubes = async () => {
    const res = await fetch('/api/youtube')
    const data = await res.json()
    if (data.success) {
      setYoutubes(data.data)
    }
  }

  const columns = [
    {
      accessorKey: 'image',
      header: 'Image',
      cell: ({ row }) => (
        <Image
          src={row.getValue('image')}
          alt={row.getValue('title')}
          width={50}
          height={50}
        />
      ),
    },
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <div className='capitalize'>{row.getValue('title')}</div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <div className='capitalize'>{row.getValue('category')}</div>
      ),
    },
    {
      accessorKey: 'link',
      header: 'Link',
      cell: ({ row }) => (
        <a
          href={row.getValue('link')}
          target='_blank'
          rel='noopener noreferrer'
        >
          Link
        </a>
      ),
    },
    {
      id: 'actions',
      enableHiding: false,
      accessorKey: '_id',
      header: 'Actions',
      cell: ({ row }) => {
        const youtube = row.original
        return (
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() =>
                router.push(`/dashboard/youtube/edit/${youtube._id}`)
              }
            >
              Edit
            </Button>
            <Button
              variant='destructive'
              size='sm'
              onClick={() => handleDelete(youtube._id)}
            >
              Delete
            </Button>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data: youtubes,
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
    if (confirm('Are you sure you want to delete this youtube project?')) {
      const res = await fetch(`/api/youtube/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        fetchYoutubes()
        toast({
          title: 'Youtube project deleted',
          description: 'The youtube project has been deleted successfully.',
        })
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete youtube project. Please try again.',
          variant: 'destructive',
        })
      }
    }
  }

  return (
    <>
      <div className='flex items-center py-4'>
        <Input
          placeholder='Filter youtube projects...'
          value={table.getColumn('title')?.getFilterValue() ?? ''}
          onChange={(event) =>
            table.getColumn('title')?.setFilterValue(event.target.value)
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
