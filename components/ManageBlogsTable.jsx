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
import { Eye, Heart, MessageCircle, UserIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'

export default function ManageBlogsTable() {
  const [blogs, setBlogs] = useState([])
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const router = useRouter()
  const { data: session, status } = useSession()
  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    const res = await fetch('/api/blogs')
    const data = await res.json()
    if (data.success) {
      setBlogs(data.data)
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
      accessorKey: 'author.name',
      header: 'Author',
      cell: ({ row }) => (
        <div className='flex items-center'>
          {row.original.author.profilePicture ? (
            <Image
              src={row.original.author.profilePicture}
              alt={row.original.author.name}
              width={30}
              height={30}
              className='rounded-full mr-2'
            />
          ) : (
            <UserIcon className='mr-2' />
          )}
          <div>{row.original.author.name}</div>
        </div>
      ),
    },
    {
      accessorKey: 'views',
      header: 'Views',
      cell: ({ row }) => {
        const views = row.getValue('views')
        return (
          <div className='flex items-center gap-1'>
            <Eye className='h-4 w-4' />
            <span>{views > 0 ? views : '0'}</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'likes',
      header: 'Likes',
      cell: ({ row }) => {
        const likes = row.getValue('likes')
        return (
          <div className='flex items-center gap-1'>
            <Heart className='h-4 w-4 text-red-500' />
            <span>{Array.isArray(likes) ? likes.length : '0'}</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'comments',
      header: 'Comments',
      cell: ({ row }) => {
        const comments = row.getValue('comments')
        return (
          <div className='flex items-center gap-1'>
            <MessageCircle className='h-4 w-4 text-blue-500' />
            <span>{Array.isArray(comments) ? comments.length : '0'}</span>
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
        const blog = row.original
        return (
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() =>
                router.push(
                  session?.user?.role === 'admin'
                    ? `/dashboard/blogs/edit/${blog._id}`
                    : `/user/dashboard/blogs/edit/${blog._id}`
                )
              }
            >
              Edit
            </Button>
            <Button
              variant='destructive'
              size='sm'
              onClick={() => handleDelete(blog._id)}
            >
              Delete
            </Button>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data: blogs,
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
    if (confirm('Are you sure you want to delete this blog?')) {
      const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        fetchBlogs()
        toast({
          title: 'Blog deleted',
          description: 'The blog has been deleted successfully.',
        })
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete blog. Please try again.',
          variant: 'destructive',
        })
      }
    }
  }

  return (
    <>
      <div className='flex items-center py-4'>
        <Input
          placeholder='Filter blogs...'
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
