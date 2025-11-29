"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings2, CheckCircle2, LayoutGrid, Sparkles, FileText, ShoppingBag, Hash } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const PLATFORMS = [
  {
    id: "general",
    name: "General",
    color: "bg-slate-100 border-slate-200 hover:border-slate-400 text-slate-900",
    activeColor: "bg-slate-900 text-white border-slate-900",
    description: "Fully customizable settings for any use case.",
    defaults: null,
    type: "metadata"
  },
  {
    id: "adobe-stock",
    name: "Adobe Stock",
    color: "bg-red-50 border-red-100 hover:border-red-300 text-red-900",
    activeColor: "bg-red-600 text-white border-red-600",
    description: "Optimized for Adobe Stock's algorithm.",
    defaults: { titleLength: 15, descriptionLength: 35, tagCount: 49 },
    type: "metadata"
  },
  {
    id: "shutterstock",
    name: "Shutterstock",
    color: "bg-orange-50 border-orange-100 hover:border-orange-300 text-orange-900",
    activeColor: "bg-orange-600 text-white border-orange-600",
    description: "Tailored for Shutterstock's discovery.",
    defaults: { titleLength: 20, descriptionLength: 40, tagCount: 50 },
    type: "metadata"
  },
  {
    id: "freepik",
    name: "Freepik",
    color: "bg-blue-50 border-blue-100 hover:border-blue-300 text-blue-900",
    activeColor: "bg-blue-600 text-white border-blue-600",
    description: "Best for Freepik's design-focused search.",
    defaults: { titleLength: 12, descriptionLength: 25, tagCount: 30 },
    type: "metadata"
  },
  {
    id: "getty-images",
    name: "Getty Images",
    color: "bg-stone-50 border-stone-100 hover:border-stone-300 text-stone-900",
    activeColor: "bg-stone-800 text-white border-stone-800",
    description: "Editorial standard for Getty & iStock.",
    defaults: { titleLength: 15, descriptionLength: 30, tagCount: 40 },
    type: "metadata"
  },
  {
    id: "instagram",
    name: "Instagram",
    color: "bg-pink-50 border-pink-100 hover:border-pink-300 text-pink-900",
    activeColor: "bg-pink-600 text-white border-pink-600",
    description: "Engaging captions with optimized hashtags.",
    defaults: { titleLength: 10, descriptionLength: 50, tagCount: 30 },
    type: "social"
  },
  {
    id: "pinterest",
    name: "Pinterest",
    color: "bg-red-50 border-red-100 hover:border-red-300 text-red-900",
    activeColor: "bg-red-700 text-white border-red-700",
    description: "Keyword-rich descriptions for pins.",
    defaults: { titleLength: 20, descriptionLength: 60, tagCount: 15 },
    type: "social"
  },
  {
    id: "etsy",
    name: "Etsy",
    color: "bg-orange-50 border-orange-100 hover:border-orange-300 text-orange-900",
    activeColor: "bg-orange-700 text-white border-orange-700",
    description: "Product-focused titles and tags.",
    defaults: { titleLength: 25, descriptionLength: 100, tagCount: 13 },
    type: "ecommerce"
  },
  {
    id: "shopify",
    name: "Shopify",
    color: "bg-green-50 border-green-100 hover:border-green-300 text-green-900",
    activeColor: "bg-green-700 text-white border-green-700",
    description: "SEO-friendly product descriptions.",
    defaults: { titleLength: 15, descriptionLength: 150, tagCount: 20 },
    type: "ecommerce"
  },
]

export default function MetadataSettings({ settings, onSettingsChange }) {
  const handleModeChange = (mode) => {
    onSettingsChange({ ...settings, mode })
  }

  const handlePlatformSelect = (platformId) => {
    const platform = PLATFORMS.find((p) => p.id === platformId)
    
    if (platform.defaults) {
      onSettingsChange({
        ...settings,
        platform: platformId,
        ...platform.defaults,
      })
    } else {
      onSettingsChange({
        ...settings,
        platform: platformId,
      })
    }
  }

  const handleChange = (key, value) => {
    onSettingsChange({ ...settings, [key]: value })
  }

  const isCustomMode = settings.platform === "general"
  const isPromptMode = settings.mode === "prompt"

  return (
    <Card className="mb-8 border-emerald-100 shadow-sm overflow-hidden">
      <CardHeader className="pb-4 bg-emerald-50/50">
        <CardTitle className="text-lg flex items-center justify-between text-emerald-800">
          <div className="flex items-center">
            <Settings2 className="mr-2 h-5 w-5" />
            Generation Settings
          </div>
          
          <Tabs value={settings.mode || "metadata"} onValueChange={handleModeChange} className="w-[300px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="metadata" className="flex items-center gap-2">
                <FileText size={14} /> Metadata
              </TabsTrigger>
              <TabsTrigger value="prompt" className="flex items-center gap-2">
                <Sparkles size={14} /> Image to Prompt
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 grid gap-8">
        
        {/* Platform Selection - Only show relevant platforms if we wanted to filter, but user asked for all */}
        {/* For Prompt mode, platform selection might be less relevant, or we can treat it as "Style" */}
        {!isPromptMode && (
          <div className="space-y-4">
            <Label className="text-base font-semibold text-gray-700 flex items-center gap-2">
              <LayoutGrid size={18} /> Target Platform
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {PLATFORMS.map((platform) => {
                const isActive = settings.platform === platform.id
                return (
                  <button
                    key={platform.id}
                    onClick={() => handlePlatformSelect(platform.id)}
                    className={cn(
                      "relative flex flex-col items-start p-4 rounded-xl border-2 transition-all duration-200 text-left h-full",
                      isActive ? platform.activeColor : platform.color,
                      isActive ? "shadow-md scale-[1.02]" : "hover:scale-[1.01]"
                    )}
                  >
                    <div className="font-bold text-sm mb-1 flex justify-between w-full">
                      {platform.name}
                      {isActive && <CheckCircle2 size={16} />}
                    </div>
                    <p className={cn("text-xs opacity-80", isActive ? "text-white/90" : "text-gray-600")}>
                      {platform.description}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Prompt Mode Settings */}
        {isPromptMode && (
          <div className="p-6 bg-purple-50 rounded-xl border border-purple-100 text-center">
            <Sparkles className="mx-auto h-12 w-12 text-purple-500 mb-4" />
            <h3 className="text-lg font-semibold text-purple-900 mb-2">Image to Prompt Generator</h3>
            <p className="text-purple-700 max-w-md mx-auto">
              This mode will analyze your image and generate a highly detailed text prompt compatible with Midjourney, Stable Diffusion, and other AI image generators.
            </p>
          </div>
        )}

        {/* Metadata Settings Grid - Hide in Prompt Mode */}
        {!isPromptMode && (
          <div className={cn(
            "grid grid-cols-1 md:grid-cols-2 gap-8 p-6 rounded-xl border transition-all duration-300",
            isCustomMode ? "bg-white border-gray-100" : "bg-gray-50 border-gray-100 opacity-90"
          )}>
            
            {/* Tag Count */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label htmlFor="tagCount" className="text-gray-700 font-medium">Number of Tags</Label>
                <span className={cn(
                  "text-xs font-bold px-2 py-1 rounded-full",
                  isCustomMode ? "bg-emerald-100 text-emerald-700" : "bg-gray-200 text-gray-600"
                )}>
                  {settings.tagCount}
                </span>
              </div>
              <Slider
                id="tagCount"
                min={5}
                max={50}
                step={1}
                value={[settings.tagCount]}
                onValueChange={(vals) => handleChange("tagCount", vals[0])}
                disabled={!isCustomMode}
                className={cn("py-2", !isCustomMode && "opacity-50 cursor-not-allowed")}
              />
              {!isCustomMode && <p className="text-xs text-gray-500">Auto-set for {PLATFORMS.find(p => p.id === settings.platform)?.name}</p>}
            </div>

            {/* Text Lengths */}
            <div className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="titleLength" className="text-gray-700 font-medium text-xs">Title Words</Label>
                    <Input
                      id="titleLength"
                      type="number"
                      min={5}
                      max={50}
                      value={settings.titleLength}
                      onChange={(e) => handleChange("titleLength", parseInt(e.target.value) || 15)}
                      disabled={!isCustomMode}
                      className={cn(!isCustomMode && "bg-gray-100 text-gray-500")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="descLength" className="text-gray-700 font-medium text-xs">Desc. Words</Label>
                    <Input
                      id="descLength"
                      type="number"
                      min={10}
                      max={150}
                      value={settings.descriptionLength}
                      onChange={(e) => handleChange("descriptionLength", parseInt(e.target.value) || 30)}
                      disabled={!isCustomMode}
                      className={cn(!isCustomMode && "bg-gray-100 text-gray-500")}
                    />
                  </div>
               </div>
               {!isCustomMode && <p className="text-xs text-gray-500">Optimized lengths for {PLATFORMS.find(p => p.id === settings.platform)?.name}</p>}
            </div>

            {/* Negative Keywords - Always Active */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="negativeKeywords" className="text-gray-700 font-medium">Negative Keywords (Optional)</Label>
              <Textarea
                id="negativeKeywords"
                placeholder="Enter words to exclude, separated by commas (e.g., text, watermark, blur)"
                value={settings.negativeKeywords}
                onChange={(e) => handleChange("negativeKeywords", e.target.value)}
                className="h-20 resize-none focus:border-emerald-500 focus:ring-emerald-500"
              />
              <p className="text-xs text-gray-500">These concepts will be explicitly excluded from the generated metadata.</p>
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  )
}
