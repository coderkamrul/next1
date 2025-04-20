"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, Download } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function ResultsDisplay({ results }) {
  const [activeTab, setActiveTab] = useState("0")

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({
          title: "Copied to clipboard",
          description: "The text has been successfully copied.",
        })
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
      })
  }

  const downloadAsJson = (result) => {
    const dataStr = JSON.stringify(
      {
        title: result.title,
        description: result.description,
        tags: result.tags,
      },
      null,
      2,
    )

    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = `${result.filename.split(".")[0]}-metadata.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  // Function to display tags properly (with underscores already in place)
  const displayTag = (tag) => {
    return tag
  }

  if (results.length === 0) {
    return null
  }

  return (
    <div>
      <Tabs defaultValue="0" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 flex overflow-x-auto">
          {results.map((result, index) => (
            <TabsTrigger key={index} value={index.toString()} className="min-w-[100px]">
              Image {index + 1}
            </TabsTrigger>
          ))}
        </TabsList>

        {results.map((result, index) => (
          <TabsContent key={index} value={index.toString()} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <img
                  src={result.imageUrl || "/placeholder.svg"}
                  alt={result.title || result.filename}
                  className="w-full h-auto rounded-md"
                />
                <p className="text-sm text-center mt-2">{result.filename}</p>
              </div>

              <div className="md:col-span-2 space-y-4">
                <Card className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">
                      Title <span className="text-xs">({result.title.split(" ").length} words)</span>
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.title)}>
                      <Copy size={14} />
                    </Button>
                  </div>
                  <p>{result.title}</p>
                </Card>

                <Card className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">
                      Description{" "}
                      <span className="text-xs">
                        ({result.description.split(" ").length} words)
                      </span>
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.description)}>
                      <Copy size={14} />
                    </Button>
                  </div>
                  <p>{result.description}</p>
                </Card>

                <Card className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">Tags</h3>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.tags.join(", "))}>
                      <Copy size={14} />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary">
                        {displayTag(tag)}
                      </Badge>
                    ))}
                  </div>
                </Card>

                <div className="flex justify-end">
                  <Button variant="outline" onClick={() => downloadAsJson(result)} className="flex items-center">
                    <Download size={14} className="mr-2" />
                    Download JSON
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
