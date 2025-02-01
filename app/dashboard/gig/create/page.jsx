"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import OverviewForm from "@/components/create-gig/OverviewForm"
import PricingForm from "@/components/create-gig/PricingForm"
import DescriptionForm from "@/components/create-gig/DescriptionForm"
import RequirementsForm from "@/components/create-gig/RequirementsForm"
import GalleryForm from "@/components/create-gig/GalleryForm"
import PublishForm from "@/components/create-gig/PublishForm"

const steps = ["Overview", "Pricing", "Description", "Requirements", "Gallery", "Publish"]

export default function CreateGigPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({})
  const [completedSteps, setCompletedSteps] = useState([])
  const router = useRouter()
  const { toast } = useToast()

  const handleNext = (data) => {
    setFormData((prev) => ({ ...prev, ...data }))
    setCompletedSteps((prev) => [...new Set([...prev, currentStep])])
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleSubmit = async (data) => {
    console.log(data);
    const finalData = { ...formData, ...data }
    try {
      const response = await fetch("/api/gigs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      const result = await response.json();
      
      console.log(result);
      toast({
        title: "Success",
        description: "Gig created successfully!",
        variant: "success",
      });
      router.push("/dashboard/gig");
    } catch (error) {
      console.error("Failed to create gig:", error);
    }
  }

  const isStepCompleted = (stepIndex) => {
    return completedSteps.includes(stepIndex)
  }

  const canNavigateToStep = (stepIndex) => {
    return stepIndex === 0 || isStepCompleted(stepIndex - 1)
  }

  const handleStepChange = (stepIndex) => {
    if (canNavigateToStep(stepIndex)) {
      setCurrentStep(stepIndex)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Create a New Gig</h1>
      <Tabs value={steps[currentStep].toLowerCase()} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          {steps.map((step, index) => (
            <TabsTrigger
              key={step}
              value={step.toLowerCase()}
              disabled={!canNavigateToStep(index)}
              onClick={() => handleStepChange(index)}
              className={`data-[state=active]:bg-primary data-[state=active]:text-primary-foreground ${
                isStepCompleted(index) ? "bg-green-100" : ""
              }`}
            >
              {step}
            </TabsTrigger>
          ))}
        </TabsList>
        <Card className="mt-6">
          <CardContent className="pt-6">
            <TabsContent value="overview">
              <OverviewForm onNext={handleNext} data={formData} />
            </TabsContent>
            <TabsContent value="pricing">
              <PricingForm onNext={handleNext} onBack={handleBack} data={formData} />
            </TabsContent>
            <TabsContent value="description">
              <DescriptionForm onNext={handleNext} onBack={handleBack} data={formData} />
            </TabsContent>
            <TabsContent value="requirements">
              <RequirementsForm onNext={handleNext} onBack={handleBack} data={formData} />
            </TabsContent>
            <TabsContent value="gallery">
              <GalleryForm onNext={handleNext} onBack={handleBack} data={formData} />
            </TabsContent>
            <TabsContent value="publish">
              <PublishForm onSubmit={handleSubmit} onBack={handleBack} data={formData} />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  )
}

