import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function PublishForm({ onSubmit, onBack, data }) {
  const [agreed, setAgreed] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (agreed) {
      onSubmit(data)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Review Your Gig</h2>
        <pre className="bg-muted p-4 rounded-md overflow-auto">{JSON.stringify(data, null, 2)}</pre>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="terms" checked={agreed} onCheckedChange={setAgreed} />
        <Label htmlFor="terms">I agree to Fiverr's Terms of Service and Community Standards</Label>
      </div>
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" disabled={!agreed}>
          Publish Gig
        </Button>
      </div>
    </form>
  )
}

