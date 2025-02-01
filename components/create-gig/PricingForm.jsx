import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PricingForm({ onNext, onBack, data }) {
  const [packages, setPackages] = useState(
    data.packages || [
      { name: "Basic", title: "", description: "", deliveryTime: "", revisions: "", price: "", features: [""] },
      { name: "Standard", title: "", description: "", deliveryTime: "", revisions: "", price: "", features: [""] },
      { name: "Premium", title: "", description: "", deliveryTime: "", revisions: "", price: "", features: [""] },
    ],
  )

  const handleChange = (index, field, value) => {
    const newPackages = [...packages]
    newPackages[index][field] = value
    setPackages(newPackages)
  }

  const handleFeatureChange = (packageIndex, featureIndex, value) => {
    const newPackages = [...packages]
    newPackages[packageIndex].features[featureIndex] = value
    setPackages(newPackages)
  }

  const addFeature = (packageIndex) => {
    const newPackages = [...packages]
    newPackages[packageIndex].features.push("")
    setPackages(newPackages)
  }

  const removeFeature = (packageIndex, featureIndex) => {
    const newPackages = [...packages]
    newPackages[packageIndex].features.splice(featureIndex, 1)
    setPackages(newPackages)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onNext({ packages })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{pkg.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor={`title-${index}`}>Package Title</Label>
                <Input
                  id={`title-${index}`}
                  value={pkg.title}
                  onChange={(e) => handleChange(index, "title", e.target.value)}
                  placeholder="e.g., Basic Website Design"
                  required
                />
              </div>
              <div>
                <Label htmlFor={`description-${index}`}>Description</Label>
                <Textarea
                  id={`description-${index}`}
                  value={pkg.description}
                  onChange={(e) => handleChange(index, "description", e.target.value)}
                  placeholder="Brief description of this package"
                  required
                />
              </div>
              <div>
                <Label>What's Included</Label>
                {pkg.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center space-x-2 mt-2">
                    <Input
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, featureIndex, e.target.value)}
                      placeholder={`Feature ${featureIndex + 1}`}
                      required
                    />
                    <Button type="button" variant="outline" onClick={() => removeFeature(index, featureIndex)}>
                      -
                    </Button>
                  </div>
                ))}
                <Button type="button" onClick={() => addFeature(index)} className="mt-2">
                  Add Feature
                </Button>
              </div>
              <div>
                <Label htmlFor={`deliveryTime-${index}`}>Delivery Time (days)</Label>
                <Input
                  id={`deliveryTime-${index}`}
                  type="number"
                  value={pkg.deliveryTime}
                  onChange={(e) => handleChange(index, "deliveryTime", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor={`revisions-${index}`}>Number of Revisions</Label>
                <Input
                  id={`revisions-${index}`}
                  type="number"
                  value={pkg.revisions}
                  onChange={(e) => handleChange(index, "revisions", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor={`price-${index}`}>Price ($)</Label>
                <Input
                  id={`price-${index}`}
                  type="number"
                  value={pkg.price}
                  onChange={(e) => handleChange(index, "price", e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>
        ))}
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

