"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Check, Copy, Eye, SortAsc, SortDesc } from "lucide-react";

import { toast } from "@/hooks/use-toast";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function Page() {
  const [orders, setOrders] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [copied, setCopied] = useState(null);
  useEffect(() => {
    axios.get("/api/order").then((response) => {
      setOrders(response.data.data);
      console.log(response.data.data);
    });
  }, []);
  const updateOrderStatus = async (id, status, orders, setOrders) => {
    try {
      await axios.put(`/api/order/${id}`, { status });
      setOrders(
        orders.map((order) => (order._id === id ? { ...order, status } : order))
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const columns = [
    {
      accessorKey: "orderNumber",
      header: "Order Number",
      cell: ({ row }) => {
        const orderNumber = row.getValue("orderNumber");
        return (
          <div className="capitalize">
            {orderNumber
              ? orderNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
              : "N/A"}
          </div>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "status",
      header: "Status",

      cell: ({ row }) => (
        <Select
          onValueChange={(value) =>
            updateOrderStatus(row.original._id, value, orders, setOrders)
          }
          defaultValue={row.getValue("status")}
        >
          <SelectTrigger className="w-[150px] border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md">
            <SelectItem value="pending">
              <span className="text-gray-500">Pending</span>
            </SelectItem>
            <SelectItem value="processing">
              <span className="text-yellow-500">Processing</span>
            </SelectItem>
            <SelectItem value="completed">
              <span className="text-green-500">Completed</span>
            </SelectItem>
            <SelectItem value="canceled">
              <span className="text-red-500">Canceled</span>
            </SelectItem>
          </SelectContent>
        </Select>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "total",
      header: "Total",
      cell: ({ row }) => (
        <div className="capitalize">{row.original.package?.price}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "package.title",
      header: "Package",
      cell: ({ row }) => (
        <div className="capitalize">{row.original.package?.title}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "client.name",
      header: "Client",
      cell: ({ row }) => (
        <div className="capitalize">{row.original.client?.name}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "client.email",
      header: "Email",
      cell: ({ row }) => (
        <div className="capitalize">{row.original.client?.email}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      enableSorting: true,
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="space-y-6 p-6">
              {/* Header */}
              <SheetHeader className="flex items-center justify-between">
                <SheetTitle>Order Details</SheetTitle>
                <SheetClose asChild>
                  <Button variant="outline" size="sm">
                    Close
                  </Button>
                </SheetClose>
              </SheetHeader>

              {/* Order Info */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold">Order Information</h3>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
                  <dt className="text-sm font-medium text-gray-500">
                    Order Number
                  </dt>
                  <dd className="text-sm font-medium">
                    {row.getValue("orderNumber")}
                  </dd>

                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd>
                    <Select
                      onValueChange={(value) =>
                        updateOrderStatus(
                          row.original._id,
                          value,
                          orders,
                          setOrders
                        )
                      }
                      defaultValue={row.getValue("status")}
                    >
                      <SelectTrigger className="w-[150px] border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md">
                        <SelectItem value="pending">
                          <span className="text-gray-500">Pending</span>
                        </SelectItem>
                        <SelectItem value="processing">
                          <span className="text-yellow-500">Processing</span>
                        </SelectItem>
                        <SelectItem value="completed">
                          <span className="text-green-500">Completed</span>
                        </SelectItem>
                        <SelectItem value="canceled">
                          <span className="text-red-500">Canceled</span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </dd>

                  <dt className="text-sm font-medium text-gray-500">
                    Created At
                  </dt>
                  <dd className="text-sm font-medium">
                    {new Date(row.getValue("createdAt")).toLocaleString()}
                  </dd>
                </dl>
              </div>

              {/* Package Details */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold">Package Details</h3>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
                  <dt className="text-sm font-medium text-gray-500">Title</dt>
                  <dd className="text-sm font-medium">
                    {row.original.package?.title}
                  </dd>

                  <dt className="text-sm font-medium text-gray-500">Price</dt>
                  <dd className="text-sm font-medium">
                    ${row.original.package?.price}
                  </dd>

                  <dt className="text-sm font-medium text-gray-500">
                    Delivery Time
                  </dt>
                  <dd className="text-sm font-medium">
                    {row.original.package?.deliveryTime} days
                  </dd>

                  <dt className="text-sm font-medium text-gray-500">
                    Revisions
                  </dt>
                  <dd className="text-sm font-medium">
                    {row.original.package?.revisions}
                  </dd>

                  <dt className="text-sm font-medium text-gray-500">
                    Features
                  </dt>
                  <dd className="text-sm font-medium">
                    {row.original.package?.features?.join(", ")}
                  </dd>
                </dl>
              </div>

              {/* Client Details */}
              <div>
                <h3 className="text-lg font-semibold">Client Information</h3>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="text-sm font-medium">
                    {row.original.client?.name}
                  </dd>

                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    Email
                    <button
                      type="button"
                      className="text-gray-500 hover:text-gray-700 ml-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(
                          row.original.client?.email
                        );
                      }}
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </dt>
                  <dd className="text-sm font-medium">
                    {row.original.client?.email}
                  </dd>

                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    Phone
                    <button
                      type="button"
                      className="text-gray-500 hover:text-gray-700 ml-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(
                          row.original.client?.phone
                        );
                      }}
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </dt>
                  <dd className="text-sm font-medium">
                    {row.original.client?.phone}
                  </dd>

                  <dt className="text-sm font-medium text-gray-500">Message</dt>
                  <dd className="text-sm font-medium">
                    {row.original.client?.message}
                  </dd>
                </dl>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2">
                <Button
                  variant="destructive"
                  onClick={() => {
                    axios.delete(`/api/order/${row.original._id}`).then(() => {
                      toast({ description: "Order deleted successfully." });
                      setOrders(
                        orders.filter((order) => order._id !== row.original._id)
                      );
                    });
                  }}
                >
                  Delete Order
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: orders,
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
      setOrders,
    },
  });

  return (
    <div className="w-full my-10">
      <h1 className="text-2xl font-semibold tracking-tight">Manage Orders</h1>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by order number or status..."
          value={table.getColumn("orderNumber")?.getFilterValue() ?? ""}
          onChange={(event) => {
            table.getColumn("orderNumber").setFilterValue(event.target.value);
            table.getColumn("status").setFilterValue(event.target.value);
          }}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllLeafColumns()
              .filter(
                (column) => !["actions", "orderNumber"].includes(column.id)
              )
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className="cursor-pointer select-none"
                    >
                      <div className="flex  items-center gap-2">
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
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
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
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
