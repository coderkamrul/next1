'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ComponentCard from '@/components/ComponentCard'

const page = () => {
  const [component, setComponent] = useState(null)

  useEffect(() => {
    const fetchComponent = async () => {
      const res = await axios.get('/api/components/all')
      setComponent(res.data.data)
    }
    fetchComponent()
  }, [])

  return (
    <div>
      {component &&
        component.map((comp) => (
          <ComponentCard key={comp._id} component={comp} />
        ))}
    </div>
  )
}

export default page
