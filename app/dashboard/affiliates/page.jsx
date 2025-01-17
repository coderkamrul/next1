'use client'

import { useEffect, useState } from 'react'
import ManageAffiliatesTable from '@/components/ManageAffiliatesTable'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet'
import AddAffiliateForm from '@/components/AddAffiliateForm'
import axios from 'axios'

export default function ManageAffiliates() {
  const [isOpen, setIsOpen] = useState(false)
  const [affiliates, setAffiliates] = useState([])

  function openSheet() {
    setIsOpen(true)
  }

  function closeSheet() {
    setIsOpen(false)
  }
  useEffect(() => {
    fetchAffiliates()
  }, [])

  const fetchAffiliates = async () => {
    const res = await axios.get('/api/affiliates')
    const data = res.data
    if (data.success) {
      setAffiliates(data.data)
    }
  }

  return (
    <div className='container mx-auto py-10'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>Manage Affiliates</h1>
        <Button variant='outline' onClick={openSheet}>
          Add New Affiliate
        </Button>
      </div>
      <ManageAffiliatesTable
        affiliates={affiliates}
        fetchAffiliates={fetchAffiliates}
      />
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Add New Affiliate</SheetTitle>
          </SheetHeader>
          <AddAffiliateForm
            closeSheet={closeSheet}
            fetchAffiliates={fetchAffiliates}
          />
        </SheetContent>
      </Sheet>
    </div>
  )
}
