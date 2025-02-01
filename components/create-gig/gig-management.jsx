"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import Link from "next/link"



export function GigManagement() {
  const [filterValue, setFilterValue] = useState("")

  const [gigs, setGigs] = useState([]);

  const fetchGigs = async () => {
    const res = await fetch("/api/gigs");
    const data = await res.json();
    setGigs(data?.data);
  };

  useEffect(() => {
    fetchGigs();
  }, []);



  const filteredData = gigs.filter((gig) => gig.title.toLowerCase().includes(filterValue.toLowerCase()))

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Gig Management</h1>
        <Link href="/dashboard/gig/create">
          <Button>Create New Gig</Button>
        </Link>
      </div>
      <Input
        placeholder="Filter gigs..."
        value={filterValue}
        onChange={(e) => setFilterValue(e.target.value)}
        className="max-w-sm"
      />
      <DataTable columns={columns} data={filteredData} />
    </div>
  )
}

