"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { MoreHorizontal, FileEdit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

export const columns = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const gig = row.original;
      const startingPrice = gig.packages[0].price;
      const highestPrice = gig.packages[2].price;
      const formattedStartingPrice = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(startingPrice);
      const formattedHighestPrice = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(highestPrice);

      return (
        <div className="font-medium">
          {formattedStartingPrice} - {formattedHighestPrice}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const gig = row.original;
      const [status, setStatus] = useState(gig.status);

      const handleChangeStatus = async (newStatus) => {
        const res = await fetch(`/api/gigs/${gig._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        });
        const data = await res.json();
        if (data.success) {
          setStatus(newStatus);
          toast({
            title: "Status updated",
            description: "The status has been updated successfully.",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to update status. Please try again.",
            variant: "destructive",
          });
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-fit">
              {status}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {["active", "paused", "draft"].map((option) => (
              <DropdownMenuItem
                key={option}
                onClick={() => handleChangeStatus(option)}
                disabled={option === status}
              >
                {option}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const gig = row.original;
      const [isDialogOpen, setDialogOpen] = useState(false);

      const handleConfirmDelete = async () => {
        const res = await fetch(`/api/gigs/${gig._id}`, { method: "DELETE" });
        const data = await res.json();
        if (data.success) {
          location.reload();
          toast({
            title: "Gig deleted",
            description: "The gig has been deleted successfully.",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to delete gig. Please try again.",
            variant: "destructive",
          });
        }
        setDialogOpen(false);
      };

      return (
        <>
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
                <Link href={`/services/${gig._id}`} className="cursor-pointer">
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/gig/${gig._id}/edit`} className="cursor-pointer">
                  <FileEdit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDialogOpen(true)}
                className="cursor-pointer"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Delete</DialogTitle>
              </DialogHeader>
              <p>Are you sure you want to delete this gig?</p>
              <div className="flex justify-end space-x-2 mt-4">
                <DialogClose asChild>
                  <Button variant="secondary">Cancel</Button>
                </DialogClose>
                <Button variant="destructive" onClick={handleConfirmDelete}>
                  Delete
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      );
    },
  },
];

