"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2, Star } from "lucide-react"
import ImageUploader from "@/components/image-uploader"
import ApiKeyInput from "@/components/api-key-input"
import ResultsDisplay from "@/components/results-display"
import MetadataSettings from "@/components/metadata-settings"

export default function GenerateTitle() {
  const [apiKey, setApiKey] = useState("")
  const [apiType, setApiType] = useState("gemini")
  const [images, setImages] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [results, setResults] = useState([])
  
  const [settings, setSettings] = useState({
    mode: "metadata",
    platform: "general",
    titleLength: 20,
    descriptionLength: 40,
    tagCount: 30,
    negativeKeywords: "",
  })

  useEffect(() => {
    // Load API key from localStorage on component mount
    try {
      const savedApiKey = localStorage.getItem("apiKey")
      const savedApiType = localStorage.getItem("apiType") || "gemini"
      if (savedApiKey) setApiKey(savedApiKey)
      if (savedApiType) setApiType(savedApiType)
      console.log("Loaded from localStorage:", { savedApiKey: !!savedApiKey, savedApiType })
    } catch (error) {
      console.error("Error accessing localStorage:", error)
    }
  }, [])

  const handleApiKeyChange = (key, type) => {
    setApiKey(key)
    setApiType(type)
    // Save to localStorage
    try {
      localStorage.setItem("apiKey", key)
      localStorage.setItem("apiType", type)
      console.log("Saved to localStorage:", { key: !!key, type })
    } catch (error) {
      console.error("Error saving to localStorage:", error)
      alert("Failed to save API key to localStorage. Please check your browser settings.")
    }
  }

  const handleImageUpload = (uploadedImages) => {
    setImages(uploadedImages)
    setResults([])
  }

  const generateMetadata = async () => {
    if (!apiKey || images.length === 0) return

    setIsProcessing(true)

    try {
      const newResults = []

      for (const image of images) {
        // Resize image before processing
        const resizedImage = await resizeImage(image)

        // Convert image to base64 for API request
        const reader = new FileReader()

        const result = await new Promise((resolve) => {
          reader.onload = () => {
            const base64Image = reader.result.split(",")[1]
            resolve(base64Image)
          }
          reader.readAsDataURL(resizedImage)
        })

        // Call our API route to process the image
        const response = await fetch("/api/generate-metadata", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: result,
            apiKey,
            apiType,
            filename: image.name,
            settings,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to generate metadata")
        }

        const data = await response.json()

        newResults.push({
          filename: image.name,
          imageUrl: URL.createObjectURL(image), // Use original image for display
          title: data.title,
          description: data.description,
          tags: data.tags,
        })
      }

      setResults(newResults)
    } catch (error) {
      console.error("Error generating metadata:", error)
      alert("Error generating metadata. Please check your API key and try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  // Helper function to resize images before processing
  const resizeImage = async (file) => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        // Create a canvas to resize the image
        const canvas = document.createElement("canvas")

        // Set maximum dimensions
        const MAX_WIDTH = 800
        const MAX_HEIGHT = 800

        let width = img.width
        let height = img.height

        // Resize logic
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width
            width = MAX_WIDTH
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height
            height = MAX_HEIGHT
          }
        }

        canvas.width = width
        canvas.height = height

        // Draw resized image on canvas
        const ctx = canvas.getContext("2d")
        ctx.drawImage(img, 0, 0, width, height)

        // Convert canvas to Blob
        canvas.toBlob(
          (blob) => {
            // Create a new File from the blob
            const resizedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            })
            resolve(resizedFile)
          },
          "image/jpeg",
          0.8,
        ) // 0.8 quality for JPEG
      }

      // Load image from file
      img.src = URL.createObjectURL(file)
    })
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-100 to-sky-200">
      <div className="container mx-auto px-4 py-8">
        

        <div className="text-center mb-12">
          {/* <div className="inline-block bg-white/80 rounded-full px-4 py-1 mb-4">
            <span className="text-gray-700">30K Metadata generated daily.</span>
          </div> */}

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Generate Free <span className="text-emerald-500">Stock Images</span>{" "}
            <span className="text-slate-500">SEO</span>
            <br />
            <span className="text-purple-500">Metadata</span> with <span className="text-gray-800">AI</span>
          </h1>

          {/* <p className="text-gray-700 max-w3xl mx-auto mb-6">
            TagPik Clone is a simple, free tool that helps you create SEO-friendly metadata for your stock images using
            AI. Whether you're a photographer, artist, or stock website owner, we make it easy to generate title,
            descriptions and keywords that help your work stand out on stock websites.
          </p> */}

          {/* <div className="flex items-center justify-center mb-6">
            <div className="flex -space-x-2 mr-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white" />
              ))}
              <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">
                +99
              </div>
            </div>
            <div className="mr-4">
              <div className="font-bold">150K Happy users every month</div>
              <div className="flex text-yellow-500">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
            </div>
            <Button className="bg-yellow-500 hover:bg-yellow-600">
              Try it Free <span className="ml-1">→</span>
            </Button>
          </div> */}
        </div>

        <Card className="max-w-4xl mx-auto p-6 mb-12">
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">01. Enter your API Key</h2>
            <ApiKeyInput apiKey={apiKey} apiType={apiType} onApiKeyChange={handleApiKeyChange} />
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">02. Configure Settings</h2>
            <MetadataSettings settings={settings} onSettingsChange={setSettings} />
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">03. Upload Images and Process</h2>
            <ImageUploader onImagesSelected={handleImageUpload} />

            <div className="mt-4 flex justify-center">
              <Button
                onClick={generateMetadata}
                disabled={!apiKey || images.length === 0 || isProcessing}
                className="bg-emerald-500 hover:bg-emerald-600"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  settings.mode === "prompt" ? "Generate Prompt" : "Generate Metadata"
                )}
              </Button>
            </div>
          </div>

          {results.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">04. Your Generated Metadata</h2>
              <ResultsDisplay results={results} />
            </div>
          )}
        </Card>

        <div className="text-center text-sm text-gray-500">
          <p>Note: Images are processed and deleted instantly. We don't store them.</p>
        </div>
      </div>
    </main>
  )
}
