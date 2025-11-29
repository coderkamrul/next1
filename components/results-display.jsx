"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Download, X, Plus } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function ResultsDisplay({ results }) {
  const [activeTab, setActiveTab] = useState("0")
  const [localResults, setLocalResults] = useState(results)

  useEffect(() => {
    setLocalResults(results)
  }, [results])

  const handleRemoveTag = (resultIndex, tagIndex) => {
    const newResults = [...localResults]
    newResults[resultIndex].tags.splice(tagIndex, 1)
    setLocalResults(newResults)
  }

  const handleAddTag = (resultIndex, tag) => {
    if (!tag || !tag.trim()) return
    const newResults = [...localResults]
    newResults[resultIndex].tags.push(tag.trim())
    setLocalResults(newResults)
  }

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

  const downloadAsCsv = (result) => {
    const headers = ["Title", "Description", "Keywords"]
    const row = [
      `"${result.title.replace(/"/g, '""')}"`,
      `"${result.description.replace(/"/g, '""')}"`,
      `"${result.tags.join(", ").replace(/"/g, '""')}"`
    ]
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), row.join(",")].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `${result.filename.split(".")[0]}-metadata.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const downloadAllAsCsv = () => {
    const headers = ["Title", "Description", "Keywords"]
    const rows = localResults.map(result => [
      `"${result.title.replace(/"/g, '""')}"`,
      `"${result.description.replace(/"/g, '""')}"`,
      `"${result.tags.join(", ").replace(/"/g, '""')}"`
    ])
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "bulk-metadata.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Function to display tags properly (with underscores already in place)
  const displayTag = (tag) => {
    return tag
  }

  if (localResults.length === 0) {
    return null
  }

  return (
    <div>
      {localResults.length > 1 && (
        <div className="flex justify-end mb-4">
          <Button onClick={downloadAllAsCsv} className="bg-emerald-600 hover:bg-emerald-700">
            <Download size={16} className="mr-2" />
            Download All CSV
          </Button>
        </div>
      )}

      <Tabs defaultValue="0" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 flex overflow-x-auto">
          {localResults.map((result, index) => (
            <TabsTrigger key={index} value={index.toString()} className="min-w-[100px]">
              Image {index + 1}
            </TabsTrigger>
          ))}
        </TabsList>

        {localResults.map((result, index) => (
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
                {result.title === "Image to Prompt Result" ? (
                  // Prompt Mode Display
                  <Card className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">
                        Generated Prompt{" "}
                        <span className="text-xs">
                          ({result.description.split(" ").length} words)
                        </span>
                      </h3>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.description)}>
                        <Copy size={14} />
                      </Button>
                    </div>
                    <p className="whitespace-pre-wrap">{result.description}</p>
                  </Card>
                ) : (
                  // Metadata Mode Display
                  <>
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
                        <h3 className="font-medium">
                          Tags <span className="text-xs text-muted-foreground">({result.tags.length})</span>
                        </h3>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.tags.join(", "))}>
                          <Copy size={14} />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {result.tags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="secondary" className="flex items-center gap-1 pr-1 pl-2 py-1">
                            {displayTag(tag)}
                            <button 
                              onClick={() => handleRemoveTag(index, tagIndex)}
                              className="hover:bg-slate-200 rounded-full p-0.5 transition-colors"
                            >
                              <X size={12} />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <Input 
                          placeholder="Add tag..." 
                          className="h-8 w-32 text-xs"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleAddTag(index, e.currentTarget.value)
                              e.currentTarget.value = ''
                            }
                          }}
                        />
                        <span className="text-xs text-muted-foreground">Press Enter to add</span>
                      </div>
                    </Card>
                  </>
                )}

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => downloadAsCsv(result)} className="flex items-center">
                    <Download size={14} className="mr-2" />
                    Download CSV
                  </Button>
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
