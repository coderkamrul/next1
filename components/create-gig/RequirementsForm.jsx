import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function RequirementsForm({ onNext, onBack, data }) {
  const [requirements, setRequirements] = useState(data.requirements || [""])

  const handleChange = (index, value) => {
    const newRequirements = [...requirements]
    newRequirements[index] = value
    setRequirements(newRequirements)
  }

  const addRequirement = () => {
    setRequirements([...requirements, ""])
  }

  const removeRequirement = (index) => {
    const newRequirements = requirements.filter((_, i) => i !== index)
    setRequirements(newRequirements)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const filledRequirements = requirements.filter((req) => req.trim() !== "")
    if (filledRequirements.length > 0) {
      onNext({ requirements: filledRequirements })
    } else {
      alert("Please add at least one requirement before proceeding.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label>Buyer Requirements</Label>
        {requirements.map((requirement, index) => (
          <div key={index} className="flex items-center space-x-2 mt-2">
            <Input
              value={requirement}
              onChange={(e) => handleChange(index, e.target.value)}
              placeholder={`Requirement ${index + 1}`}
              required
            />
            <Button type="button" variant="outline" onClick={() => removeRequirement(index)}>
              Remove
            </Button>
          </div>
        ))}
        <Button type="button" onClick={addRequirement} className="mt-2">
          Add Requirement
        </Button>
      </div>
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit">Save & Continue</Button>
      </div>
    </form>
  )
}

