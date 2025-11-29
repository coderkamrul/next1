"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExternalLink } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function ApiKeyInput({ apiKey, apiType, onApiKeyChange }) {
  const [inputValue, setInputValue] = useState(apiKey)
  const [selectedApiType, setSelectedApiType] = useState(apiType)

  const handleSaveKey = () => {
    if (!inputValue || inputValue.trim() === "") {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive",
      })
      return
    }

    onApiKeyChange(inputValue, selectedApiType)

    // Provide feedback to the user
    toast({
      title: `${selectedApiType === "gemini" ? "Gemini" : "OpenAI"} API key saved`,
      variant: "success",
    })
  }

  const getApiLink = () => {
    switch (selectedApiType) {
      case "gemini":
        return "https://aistudio.google.com/app/apikey"
      case "openai":
        return "https://platform.openai.com/api-keys"
      default:
        return "#"
    }
  }

  useEffect(() => {
    setInputValue(apiKey)
  }, [apiKey])

  return (
    <div>
      <Tabs defaultValue={selectedApiType} onValueChange={setSelectedApiType} className="mb-4">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="gemini">Gemini API</TabsTrigger>
          <TabsTrigger value="openai">OpenAI API</TabsTrigger>
        </TabsList>

        <TabsContent value="gemini" className="mt-4">
          <p className="text-sm text-gray-600 mb-2">
            Enter your Gemini API Key to generate metadata for your images. This app uses the Gemini 2.5 Flash model.
          </p>
        </TabsContent>

        <TabsContent value="openai" className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Enter your OpenAI API Key to generate metadata for your images.</p>
        </TabsContent>
      </Tabs>

      <div className="flex gap-2">
        <Input
          type="password"
          placeholder={`Enter your ${selectedApiType === "gemini" ? "Gemini" : "OpenAI"} API Key`}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleSaveKey}>Save Key</Button>
      </div>

      <div className="mt-2 flex justify-between items-center">
        <p className="text-sm text-gray-500">{apiKey ? "API Key saved to localStorage" : "No API Key saved"}</p>
        <a
          href={getApiLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center"
        >
          Get {selectedApiType === "gemini" ? "Gemini" : "OpenAI"} API Key <ExternalLink size={14} className="ml-1" />
        </a>
      </div>
    </div>
  )
}
