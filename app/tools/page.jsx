"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Clipboard, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTheme } from "next-themes"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function DevTools() {
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState("clamp")

  // Clamp Generator State
  const [clampState, setClampState] = useState({
    minFontSize: 1,
    maxFontSize: 3,
    minViewportWidth: 31.25,
    maxViewportWidth: 56.25,
    minFontUnit: "rem",
    maxFontUnit: "rem",
    minViewportUnit: "rem",
    maxViewportUnit: "rem",
    previewText: "This text uses the generated clamp value",
    clampValue: "",
  })

  // Shadow Generator State
  const [shadowState, setShadowState] = useState({
    horizontalOffset: 5,
    verticalOffset: 5,
    blur: 10,
    spread: 0,
    color: "#00000040",
    inset: false,
    shadowValue: "",
  })

  // Grid Generator State
  const [gridState, setGridState] = useState({
    columns: 3,
    rows: 2,
    gap: 16,
    columnTemplate: "1fr 1fr 1fr",
    rowTemplate: "auto auto",
    cssCode: "",
    gridItems: [],
    selectedItem: null,
  })

  // Contrast Checker State
  const [contrastState, setContrastState] = useState({
    foregroundColor: "#000000",
    backgroundColor: "#FFFFFF",
    contrastRatio: 21,
    wcagAA: true,
    wcagAAA: true,
  })

  // Color Palette Generator State
  const [paletteState, setPaletteState] = useState({
    baseColor: "#3b82f6",
    paletteType: "monochromatic",
    palette: [],
    cssCode: "",
  })

  return (
    <main className="min-h-screen p-4 md:p-8 bg-background">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Developer Tools</h1>
        </div>

        <Tabs defaultValue="clamp" className="mb-8" onValueChange={setActiveTab}>
          <div className="overflow-x-auto pb-2">
            <TabsList className="inline-flex w-full md:w-auto min-w-full md:min-w-0 space-x-2">
              <TabsTrigger value="clamp" className="flex-1 md:flex-none whitespace-nowrap">
                Clamp Generator
              </TabsTrigger>
              <TabsTrigger value="shadow" className="flex-1 md:flex-none whitespace-nowrap">
                Shadow Generator
              </TabsTrigger>
              <TabsTrigger value="grid" className="flex-1 md:flex-none whitespace-nowrap">
                Grid Generator
              </TabsTrigger>
              <TabsTrigger value="contrast" className="flex-1 md:flex-none whitespace-nowrap">
                Contrast Checker
              </TabsTrigger>
              <TabsTrigger value="palette" className="flex-1 md:flex-none whitespace-nowrap">
                Color Palette
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="clamp">
            <ClampGenerator state={clampState} setState={setClampState} />
          </TabsContent>

          <TabsContent value="shadow">
            <ShadowGenerator state={shadowState} setState={setShadowState} />
          </TabsContent>

          <TabsContent value="grid">
            <GridGenerator state={gridState} setState={setGridState} />
          </TabsContent>

          <TabsContent value="contrast">
            <ContrastChecker state={contrastState} setState={setContrastState} />
          </TabsContent>

          <TabsContent value="palette">
            <ColorPaletteGenerator state={paletteState} setState={setPaletteState} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

function ClampGenerator({ state, setState }) {
  // Use the state from props
  const {
    minFontSize,
    maxFontSize,
    minViewportWidth,
    maxViewportWidth,
    minFontUnit,
    maxFontUnit,
    minViewportUnit,
    maxViewportUnit,
    previewText,
    clampValue,
  } = state

  // Update state helper function
  const updateState = (newValues) => {
    setState((prevState) => ({ ...prevState, ...newValues }))
  }

  // Calculate the clamp value
  useEffect(() => {
    if (minFontSize && maxFontSize && minViewportWidth && maxViewportWidth) {
      // Convert to numbers to ensure proper calculation
      const minFont = Number(minFontSize)
      const maxFont = Number(maxFontSize)
      const minVw = Number(minViewportWidth)
      const maxVw = Number(maxViewportWidth)

      // Convert to px for calculation if needed
      const minFontPx = minFontUnit === "rem" ? minFont * 16 : minFont
      const maxFontPx = maxFontUnit === "rem" ? maxFont * 16 : maxFont
      const minVwPx = minViewportUnit === "rem" ? minVw * 16 : minVw
      const maxVwPx = maxViewportUnit === "rem" ? maxVw * 16 : maxVw

      // Calculate the slope
      const slope = (maxFontPx - minFontPx) / (maxVwPx - minVwPx)

      // Calculate the viewport-based part
      const vwCalc = slope * 100

      // Calculate the intercept
      const intercept = minFontPx - slope * minVwPx

      // Format values for better readability
      const vwValue = vwCalc.toFixed(2)
      const interceptValue = intercept.toFixed(2)

      // Create the clamp value based on the selected unit
      const minFontStr = `${minFont}${minFontUnit}`
      const maxFontStr = `${maxFont}${maxFontUnit}`
      let interceptStr = `${interceptValue}px`

      if (minFontUnit === "rem" && maxFontUnit === "rem") {
        interceptStr = `${(intercept / 16).toFixed(2)}rem`
      }

      updateState({ clampValue: `clamp(${minFontStr}, ${interceptStr} + ${vwValue}vw, ${maxFontStr})` })
    }
  }, [
    minFontSize,
    maxFontSize,
    minViewportWidth,
    maxViewportWidth,
    minFontUnit,
    maxFontUnit,
    minViewportUnit,
    maxViewportUnit,
    setState,
  ])

  // Copy to clipboard function
  const copyToClipboard = () => {
    navigator.clipboard.writeText(`font-size: ${clampValue};`)
    toast({
      title: "Copied to clipboard",
      description: "The CSS code has been copied to your clipboard.",
    })
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Font-size Clamp Generator</h2>
        <p className="text-muted-foreground">Generate linearly scale font-size with clamp()</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Label htmlFor="minViewportWidth">Minimum viewport width</Label>
          <div className="flex">
            <Input
              id="minViewportWidth"
              type="number"
              value={minViewportWidth}
              onChange={(e) => updateState({ minViewportWidth: Number(e.target.value) })}
              className="rounded-r-none border dark:border-gray-700"
            />
            <Select value={minViewportUnit} onValueChange={(value) => updateState({ minViewportUnit: value })}>
              <SelectTrigger className="w-24 rounded-l-none border dark:border-gray-700">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="px">PX</SelectItem>
                <SelectItem value="rem">REM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <Label htmlFor="maxViewportWidth">Maximum viewport width</Label>
          <div className="flex">
            <Input
              id="maxViewportWidth"
              type="number"
              value={maxViewportWidth}
              onChange={(e) => updateState({ maxViewportWidth: Number(e.target.value) })}
              className="rounded-r-none border dark:border-gray-700"
            />
            <Select value={maxViewportUnit} onValueChange={(value) => updateState({ maxViewportUnit: value })}>
              <SelectTrigger className="w-24 rounded-l-none border dark:border-gray-700">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="px">PX</SelectItem>
                <SelectItem value="rem">REM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <Label htmlFor="minFontSize">Minimum font size</Label>
          <div className="flex">
            <Input
              id="minFontSize"
              type="number"
              value={minFontSize}
              onChange={(e) => updateState({ minFontSize: Number(e.target.value) })}
              className="rounded-r-none border dark:border-gray-700"
            />
            <Select value={minFontUnit} onValueChange={(value) => updateState({ minFontUnit: value })}>
              <SelectTrigger className="w-24 rounded-l-none border dark:border-gray-700">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="px">PX</SelectItem>
                <SelectItem value="rem">REM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <Label htmlFor="maxFontSize">Maximum font size</Label>
          <div className="flex">
            <Input
              id="maxFontSize"
              type="number"
              value={maxFontSize}
              onChange={(e) => updateState({ maxFontSize: Number(e.target.value) })}
              className="rounded-r-none border dark:border-gray-700"
            />
            <Select value={maxFontUnit} onValueChange={(value) => updateState({ maxFontUnit: value })}>
              <SelectTrigger className="w-24 rounded-l-none border dark:border-gray-700">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="px">PX</SelectItem>
                <SelectItem value="rem">REM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="relative mt-8">
        <div className="p-4 bg-muted/30 rounded-md font-mono text-sm overflow-x-auto border dark:border-gray-700">
          {`font-size: ${clampValue};`}
        </div>
        <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={copyToClipboard}>
          <Clipboard className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-6 border rounded-md dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-4">Preview</h3>
        <div className="p-4 border rounded-md bg-muted/30 dark:border-gray-700">
          <p className="text-center" style={{ fontSize: clampValue }}>
            {previewText}
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <Input
              className="max-w-xs border dark:border-gray-700"
              value={previewText}
              onChange={(e) => updateState({ previewText: e.target.value })}
              placeholder="Enter custom preview text"
            />
          </div>
          <p className="text-xs text-muted-foreground text-center mt-4">
            Resize your browser window to see the font size change
          </p>
        </div>
      </div>
    </div>
  )
}

function ShadowGenerator({ state, setState }) {
  // Use the state from props
  const { horizontalOffset, verticalOffset, blur, spread, color, inset, shadowValue } = state

  // Update state helper function
  const updateState = (newValues) => {
    setState((prevState) => ({ ...prevState, ...newValues }))
  }

  useEffect(() => {
    const insetValue = inset ? "inset " : ""
    updateState({
      shadowValue: `${insetValue}${horizontalOffset}px ${verticalOffset}px ${blur}px ${spread}px ${color}`,
    })
  }, [horizontalOffset, verticalOffset, blur, spread, color, inset, setState])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`box-shadow: ${shadowValue};`)
    toast({
      title: "Copied to clipboard",
      description: "The CSS code has been copied to your clipboard.",
    })
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">CSS Shadow Generator</h2>
        <p className="text-muted-foreground">Create custom box shadows with live preview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6 border dark:border-gray-700">
          <h3 className="text-xl font-semibold mb-4">Controls</h3>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="horizontalOffset">Horizontal Offset (px)</Label>
              <div className="flex">
                <Input
                  id="horizontalOffset"
                  type="number"
                  value={horizontalOffset}
                  onChange={(e) => updateState({ horizontalOffset: Number(e.target.value) })}
                  className="border dark:border-gray-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="verticalOffset">Vertical Offset (px)</Label>
              <div className="flex">
                <Input
                  id="verticalOffset"
                  type="number"
                  value={verticalOffset}
                  onChange={(e) => updateState({ verticalOffset: Number(e.target.value) })}
                  className="border dark:border-gray-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="blur">Blur Radius (px)</Label>
              <div className="flex">
                <Input
                  id="blur"
                  type="number"
                  value={blur}
                  onChange={(e) => updateState({ blur: Number(e.target.value) })}
                  className="border dark:border-gray-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="spread">Spread Radius (px)</Label>
              <div className="flex">
                <Input
                  id="spread"
                  type="number"
                  value={spread}
                  onChange={(e) => updateState({ spread: Number(e.target.value) })}
                  className="border dark:border-gray-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Shadow Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  id="colorPicker"
                  value={color.substring(0, 7)}
                  onChange={(e) => updateState({ color: e.target.value + color.substring(7) })}
                  className="w-10 h-10 p-0 border-0 rounded cursor-pointer"
                />
                <Input
                  id="color"
                  type="text"
                  value={color}
                  onChange={(e) => updateState({ color: e.target.value })}
                  placeholder="#000000"
                  className="border dark:border-gray-700"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="inset"
                checked={inset}
                onChange={(e) => updateState({ inset: e.target.checked })}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="inset">Inset Shadow</Label>
            </div>
          </div>
        </Card>

        <div className="space-y-8">
          <Card className="p-6 border dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4">Preview</h3>
            <div className="flex justify-center items-center p-16 bg-muted/30 rounded-md border dark:border-gray-700">
              <div className="w-32 h-32 rounded-md bg-white" style={{ boxShadow: shadowValue }}></div>
            </div>
          </Card>

          <Card className="p-6 border dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4">Generated CSS</h3>
            <div className="relative">
              <div className="p-4 bg-muted/30 rounded-md font-mono text-sm overflow-x-auto border dark:border-gray-700">
                {`box-shadow: ${shadowValue};`}
              </div>
              <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={copyToClipboard}>
                <Clipboard className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function GridGenerator({ state, setState }) {
  // Use the state from props
  const { columns, rows, gap, columnTemplate, rowTemplate, cssCode, gridItems = [], selectedItem } = state

  // Update state helper function
  const updateState = (newValues) => {
    setState((prevState) => ({ ...prevState, ...newValues }))
  }

  // Initialize grid items if they don't exist
  useEffect(() => {
    if (!gridItems.length || gridItems.length !== columns * rows) {
      const newGridItems = []
      for (let i = 0; i < columns * rows; i++) {
        newGridItems.push({
          id: i,
          rowSpan: 1,
          colSpan: 1,
          name: `Item ${i + 1}`,
        })
      }
      updateState({ gridItems: newGridItems })
    }
  }, [columns, rows, gridItems.length, setState])

  useEffect(() => {
    // Generate column template
    let colTemplate = ""
    if (columns > 0) {
      const colValues = columnTemplate.split(" ").filter((val) => val.trim() !== "")
      // If we have fewer values than columns, fill with 1fr
      while (colValues.length < columns) {
        colValues.push("1fr")
      }
      // If we have more values than columns, trim the excess
      colTemplate = colValues.slice(0, columns).join(" ")
      updateState({ columnTemplate: colTemplate })
    }

    // Generate row template
    let rowTemp = ""
    if (rows > 0) {
      const rowValues = rowTemplate.split(" ").filter((val) => val.trim() !== "")
      // If we have fewer values than rows, fill with auto
      while (rowValues.length < rows) {
        rowValues.push("auto")
      }
      // If we have more values than rows, trim the excess
      rowTemp = rowValues.slice(0, rows).join(" ")
      updateState({ rowTemplate: rowTemp })
    }

    // Generate CSS code
    let css = `.grid-container {
  display: grid;
  grid-template-columns: ${colTemplate};
  grid-template-rows: ${rowTemp};
  gap: ${gap}px;
}`

    // Add CSS for grid items with spans
    const itemsWithSpans = gridItems.filter((item) => item.rowSpan > 1 || item.colSpan > 1)
    if (itemsWithSpans.length > 0) {
      css += "\n\n/* Grid items with spans */\n"
      itemsWithSpans.forEach((item) => {
        css += `.grid-item-${item.id} {
  grid-row: span ${item.rowSpan};
  grid-column: span ${item.colSpan};
}\n`
      })
    }

    updateState({ cssCode: css })
  }, [columns, rows, gap, columnTemplate, rowTemplate, gridItems, setState])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cssCode)
    toast({
      title: "Copied to clipboard",
      description: "The CSS code has been copied to your clipboard.",
    })
  }

  const handleItemClick = (item) => {
    updateState({ selectedItem: item.id })
  }

  const updateGridItem = (id, updates) => {
    const updatedItems = gridItems.map((item) => (item.id === id ? { ...item, ...updates } : item))
    updateState({ gridItems: updatedItems })
  }

  const incrementRowSpan = () => {
    if (selectedItem === null) return

    const item = gridItems.find((item) => item.id === selectedItem)
    if (item && item.rowSpan < rows) {
      updateGridItem(selectedItem, { rowSpan: item.rowSpan + 1 })
    }
  }

  const decrementRowSpan = () => {
    if (selectedItem === null) return

    const item = gridItems.find((item) => item.id === selectedItem)
    if (item && item.rowSpan > 1) {
      updateGridItem(selectedItem, { rowSpan: item.rowSpan - 1 })
    }
  }

  const incrementColSpan = () => {
    if (selectedItem === null) return

    const item = gridItems.find((item) => item.id === selectedItem)
    if (item && item.colSpan < columns) {
      updateGridItem(selectedItem, { colSpan: item.colSpan + 1 })
    }
  }

  const decrementColSpan = () => {
    if (selectedItem === null) return

    const item = gridItems.find((item) => item.id === selectedItem)
    if (item && item.colSpan > 1) {
      updateGridItem(selectedItem, { colSpan: item.colSpan - 1 })
    }
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">CSS Grid Generator</h2>
        <p className="text-muted-foreground">Create custom grid layouts with live preview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6 border dark:border-gray-700">
          <h3 className="text-xl font-semibold mb-4">Grid Settings</h3>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="columns">Columns</Label>
              <Input
                id="columns"
                type="number"
                value={columns}
                onChange={(e) => updateState({ columns: Number(e.target.value) })}
                min="1"
                max="12"
                className="border dark:border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="columnTemplate">Column Template</Label>
              <Input
                id="columnTemplate"
                value={columnTemplate}
                onChange={(e) => updateState({ columnTemplate: e.target.value })}
                placeholder="e.g. 1fr 2fr 1fr"
                className="border dark:border-gray-700"
              />
              <p className="text-xs text-muted-foreground">
                Space-separated values (e.g., "1fr 2fr 1fr" or "100px auto 200px")
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rows">Rows</Label>
              <Input
                id="rows"
                type="number"
                value={rows}
                onChange={(e) => updateState({ rows: Number(e.target.value) })}
                min="1"
                max="12"
                className="border dark:border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rowTemplate">Row Template</Label>
              <Input
                id="rowTemplate"
                value={rowTemplate}
                onChange={(e) => updateState({ rowTemplate: e.target.value })}
                placeholder="e.g. auto auto"
                className="border dark:border-gray-700"
              />
              <p className="text-xs text-muted-foreground">Space-separated values (e.g., "auto 100px" or "1fr 2fr")</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gap">Gap (px)</Label>
              <Input
                id="gap"
                type="number"
                value={gap}
                onChange={(e) => updateState({ gap: Number(e.target.value) })}
                min="0"
                max="50"
                className="border dark:border-gray-700"
              />
            </div>

            {selectedItem !== null && (
              <div className="border p-4 rounded-md bg-muted/20 space-y-4 dark:border-gray-700">
                <h4 className="font-medium">Item {selectedItem + 1} Settings</h4>

                <div className="space-y-2">
                  <Label>Row Span</Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={decrementRowSpan}
                      disabled={gridItems[selectedItem]?.rowSpan <= 1}
                      className="border dark:border-gray-700"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{gridItems[selectedItem]?.rowSpan || 1}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={incrementRowSpan}
                      disabled={gridItems[selectedItem]?.rowSpan >= rows}
                      className="border dark:border-gray-700"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Column Span</Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={decrementColSpan}
                      disabled={gridItems[selectedItem]?.colSpan <= 1}
                      className="border dark:border-gray-700"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{gridItems[selectedItem]?.colSpan || 1}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={incrementColSpan}
                      disabled={gridItems[selectedItem]?.colSpan >= columns}
                      className="border dark:border-gray-700"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateState({ selectedItem: null })}
                  className="border dark:border-gray-700"
                >
                  Deselect Item
                </Button>
              </div>
            )}
          </div>
        </Card>

        <div className="space-y-8">
          <Card className="p-6 border dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4">Preview</h3>
            <div className="p-4 bg-muted/30 rounded-md overflow-auto border dark:border-gray-700">
              <div
                className="min-w-full min-h-[200px]"
                style={{
                  display: "grid",
                  gridTemplateColumns: columnTemplate,
                  gridTemplateRows: rowTemplate,
                  gap: `${gap}px`,
                }}
              >
                {gridItems.map((item) => (
                  <div
                    key={item.id}
                    className={`bg-primary/20 p-4 rounded flex items-center justify-center cursor-pointer transition-all border dark:border-gray-700 ${selectedItem === item.id ? "ring-2 ring-primary" : "hover:bg-primary/30"}`}
                    style={{
                      gridRow: `span ${item.rowSpan}`,
                      gridColumn: `span ${item.colSpan}`,
                    }}
                    onClick={() => handleItemClick(item)}
                  >
                    {item.name}
                    {(item.rowSpan > 1 || item.colSpan > 1) && (
                      <span className="text-xs ml-1 opacity-70">
                        ({item.colSpan}×{item.rowSpan})
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-6 border dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4">Generated CSS</h3>
            <div className="relative">
              <div className="p-4 bg-muted/30 rounded-md font-mono text-sm overflow-x-auto whitespace-pre border dark:border-gray-700">
                {cssCode}
              </div>
              <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={copyToClipboard}>
                <Clipboard className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function ContrastChecker({ state, setState }) {
  // Use the state from props
  const { foregroundColor, backgroundColor, contrastRatio, wcagAA, wcagAAA } = state

  // Update state helper function
  const updateState = (newValues) => {
    setState((prevState) => ({ ...prevState, ...newValues }))
  }

  useEffect(() => {
    // Calculate contrast ratio
    const calculateContrastRatio = (fg, bg) => {
      // Convert hex to RGB
      const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return result
          ? {
              r: Number.parseInt(result[1], 16),
              g: Number.parseInt(result[2], 16),
              b: Number.parseInt(result[3], 16),
            }
          : null
      }

      // Calculate relative luminance
      const calculateLuminance = (color) => {
        const rgb = hexToRgb(color)
        if (!rgb) return 0

        const { r, g, b } = rgb

        const rsrgb = r / 255
        const gsrgb = g / 255
        const bsrgb = b / 255

        const r1 = rsrgb <= 0.03928 ? rsrgb / 12.92 : Math.pow((rsrgb + 0.055) / 1.055, 2.4)
        const g1 = gsrgb <= 0.03928 ? gsrgb / 12.92 : Math.pow((gsrgb + 0.055) / 1.055, 2.4)
        const b1 = bsrgb <= 0.03928 ? bsrgb / 12.92 : Math.pow((bsrgb + 0.055) / 1.055, 2.4)

        return 0.2126 * r1 + 0.7152 * g1 + 0.0722 * b1
      }

      const l1 = calculateLuminance(fg)
      const l2 = calculateLuminance(bg)

      // Calculate contrast ratio
      const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)

      return ratio.toFixed(2)
    }

    const ratio = calculateContrastRatio(foregroundColor, backgroundColor)
    updateState({
      contrastRatio: ratio,
      wcagAA: ratio >= 4.5,
      wcagAAA: ratio >= 7,
    })
  }, [foregroundColor, backgroundColor, setState])

  const swapColors = () => {
    updateState({
      foregroundColor: backgroundColor,
      backgroundColor: foregroundColor,
    })
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Color Contrast Checker</h2>
        <p className="text-muted-foreground">Check accessibility of color combinations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6 border dark:border-gray-700">
          <h3 className="text-xl font-semibold mb-4">Color Settings</h3>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="foregroundColor">Text Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  id="foregroundColorPicker"
                  value={foregroundColor}
                  onChange={(e) => updateState({ foregroundColor: e.target.value })}
                  className="w-10 h-10 p-0 border-0 rounded cursor-pointer"
                />
                <Input
                  id="foregroundColor"
                  type="text"
                  value={foregroundColor}
                  onChange={(e) => updateState({ foregroundColor: e.target.value })}
                  placeholder="#000000"
                  className="border dark:border-gray-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="backgroundColor">Background Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  id="backgroundColorPicker"
                  value={backgroundColor}
                  onChange={(e) => updateState({ backgroundColor: e.target.value })}
                  className="w-10 h-10 p-0 border-0 rounded cursor-pointer"
                />
                <Input
                  id="backgroundColor"
                  type="text"
                  value={backgroundColor}
                  onChange={(e) => updateState({ backgroundColor: e.target.value })}
                  placeholder="#FFFFFF"
                  className="border dark:border-gray-700"
                />
              </div>
            </div>

            <Button onClick={swapColors} variant="outline" className="border dark:border-gray-700">
              <ArrowLeft className="h-4 w-4 mr-2 rotate-90" />
              Swap Colors
            </Button>
          </div>
        </Card>

        <div className="space-y-8">
          <Card className="p-6 border dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4">Preview</h3>
            <div
              className="p-8 rounded-md flex flex-col items-center justify-center space-y-4 border dark:border-gray-700"
              style={{ backgroundColor: backgroundColor, color: foregroundColor }}
            >
              <p className="text-3xl font-bold">Heading Text</p>
              <p className="text-base">This is regular paragraph text that would appear on a website.</p>
              <p className="text-sm">This is smaller text that might be used for captions or notes.</p>
            </div>
          </Card>

          <Card className="p-6 border dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4">Contrast Results</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Contrast Ratio:</span>
                <span
                  className={`font-bold text-lg ${Number(contrastRatio) >= 4.5 ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}
                >
                  {contrastRatio}:1
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>WCAG AA (minimum):</span>
                  <span className={wcagAA ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"}>
                    {wcagAA ? "Pass ✓" : "Fail ✗"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>WCAG AAA (enhanced):</span>
                  <span className={wcagAAA ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"}>
                    {wcagAAA ? "Pass ✓" : "Fail ✗"}
                  </span>
                </div>
              </div>

              <div className="text-sm text-muted-foreground mt-4">
                <p className="mb-2">WCAG Guidelines:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>AA requires a contrast ratio of at least 4.5:1 for normal text</li>
                  <li>AAA requires a contrast ratio of at least 7:1 for normal text</li>
                  <li>Large text (18pt or 14pt bold) can use 3:1 for AA and 4.5:1 for AAA</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function ColorPaletteGenerator({ state, setState }) {
  // Use the state from props
  const { baseColor, paletteType, palette, cssCode } = state

  // Update state helper function
  const updateState = (newValues) => {
    setState((prevState) => ({ ...prevState, ...newValues }))
  }

  useEffect(() => {
    // Generate palette based on the base color and palette type
    const generatePalette = () => {
      // Convert hex to HSL
      const hexToHSL = (hex) => {
        // Remove the # if present
        hex = hex.replace(/^#/, "")

        // Parse the hex values
        const r = Number.parseInt(hex.substring(0, 2), 16) / 255
        const g = Number.parseInt(hex.substring(2, 4), 16) / 255
        const b = Number.parseInt(hex.substring(4, 6), 16) / 255

        // Find the min and max values to determine the lightness
        const max = Math.max(r, g, b)
        const min = Math.min(r, g, b)

        // Calculate the lightness
        let h,
          s,
          l = (max + min) / 2

        if (max === min) {
          // Achromatic
          h = s = 0
        } else {
          const d = max - min
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

          // Calculate the hue
          switch (max) {
            case r:
              h = (g - b) / d + (g < b ? 6 : 0)
              break
            case g:
              h = (b - r) / d + 2
              break
            case b:
              h = (r - g) / d + 4
              break
          }

          h /= 6
        }

        return {
          h: Math.round(h * 360),
          s: Math.round(s * 100),
          l: Math.round(l * 100),
        }
      }

      // Convert HSL to hex
      const hslToHex = (h, s, l) => {
        h /= 360
        s /= 100
        l /= 100

        let r, g, b

        if (s === 0) {
          // Achromatic
          r = g = b = l
        } else {
          const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1
            if (t > 1) t -= 1
            if (t < 1 / 6) return p + (q - p) * 6 * t
            if (t < 1 / 2) return q
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
            return p
          }

          const q = l < 0.5 ? l * (1 + s) : l + s - l * s
          const p = 2 * l - q

          r = hue2rgb(p, q, h + 1 / 3)
          g = hue2rgb(p, q, h)
          b = hue2rgb(p, q, h - 1 / 3)
        }

        const toHex = (x) => {
          const hex = Math.round(x * 255).toString(16)
          return hex.length === 1 ? "0" + hex : hex
        }

        return `#${toHex(r)}${toHex(g)}${toHex(b)}`
      }

      const hsl = hexToHSL(baseColor)
      const newPalette = []

      switch (paletteType) {
        case "monochromatic":
          // Generate shades and tints of the same hue
          for (let i = 9; i >= 1; i--) {
            const lightness = Math.min(Math.max(hsl.l - 40 + i * 10, 5), 95)
            newPalette.push({
              name: `${i}00`,
              color: hslToHex(hsl.h, hsl.s, lightness),
            })
          }
          break

        case "complementary":
          // Base color and variations
          for (let i = 1; i <= 5; i++) {
            const lightness = Math.min(Math.max(hsl.l - 20 + i * 10, 5), 95)
            newPalette.push({
              name: `primary-${i}00`,
              color: hslToHex(hsl.h, hsl.s, lightness),
            })
          }

          // Complementary color (opposite on the color wheel) and variations
          const compHue = (hsl.h + 180) % 360
          for (let i = 1; i <= 5; i++) {
            const lightness = Math.min(Math.max(hsl.l - 20 + i * 10, 5), 95)
            newPalette.push({
              name: `secondary-${i}00`,
              color: hslToHex(compHue, hsl.s, lightness),
            })
          }
          break

        case "triadic":
          // Three colors evenly spaced on the color wheel
          const triadicHues = [hsl.h, (hsl.h + 120) % 360, (hsl.h + 240) % 360]

          for (let j = 0; j < 3; j++) {
            for (let i = 1; i <= 3; i++) {
              const lightness = Math.min(Math.max(hsl.l - 10 + i * 10, 5), 95)
              newPalette.push({
                name: `color${j + 1}-${i}00`,
                color: hslToHex(triadicHues[j], hsl.s, lightness),
              })
            }
          }
          break

        case "analogous":
          // Colors adjacent on the color wheel
          for (let j = -2; j <= 2; j++) {
            const analogousHue = (hsl.h + j * 30 + 360) % 360
            for (let i = 1; i <= 2; i++) {
              const lightness = Math.min(Math.max(hsl.l - 10 + i * 20, 5), 95)
              newPalette.push({
                name: `color${j + 3}-${i}00`,
                color: hslToHex(analogousHue, hsl.s, lightness),
              })
            }
          }
          break
      }

      // Generate CSS variables
      let css = `:root {\n`
      newPalette.forEach((color) => {
        css += `  --color-${color.name}: ${color.color};\n`
      })
      css += `}`

      updateState({
        palette: newPalette,
        cssCode: css,
      })
    }

    generatePalette()
  }, [baseColor, paletteType, setState])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cssCode)
    toast({
      title: "Copied to clipboard",
      description: "The CSS code has been copied to your clipboard.",
    })
  }

  const copyColorToClipboard = (color) => {
    navigator.clipboard.writeText(color)
    toast({
      title: "Color copied",
      description: `${color} has been copied to your clipboard.`,
    })
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Color Palette Generator</h2>
        <p className="text-muted-foreground">Create harmonious color palettes for your projects</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6 border dark:border-gray-700">
          <h3 className="text-xl font-semibold mb-4">Palette Settings</h3>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="baseColor">Base Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  id="baseColorPicker"
                  value={baseColor}
                  onChange={(e) => updateState({ baseColor: e.target.value })}
                  className="w-10 h-10 p-0 border-0 rounded cursor-pointer"
                />
                <Input
                  id="baseColor"
                  type="text"
                  value={baseColor}
                  onChange={(e) => updateState({ baseColor: e.target.value })}
                  placeholder="#3b82f6"
                  className="border dark:border-gray-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paletteType">Palette Type</Label>
              <Select value={paletteType} onValueChange={(value) => updateState({ paletteType: value })}>
                <SelectTrigger className="border dark:border-gray-700">
                  <SelectValue placeholder="Select palette type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monochromatic">Monochromatic</SelectItem>
                  <SelectItem value="complementary">Complementary</SelectItem>
                  <SelectItem value="triadic">Triadic</SelectItem>
                  <SelectItem value="analogous">Analogous</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {paletteType === "monochromatic" && "Variations of a single color"}
                {paletteType === "complementary" && "Colors opposite on the color wheel"}
                {paletteType === "triadic" && "Three colors evenly spaced on the color wheel"}
                {paletteType === "analogous" && "Colors adjacent on the color wheel"}
              </p>
            </div>
          </div>
        </Card>

        <div className="space-y-8">
          <Card className="p-6 border dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4">Generated Palette</h3>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {palette.map((color, index) => (
                <div key={index} className="text-center">
                  <button
                    className="w-full aspect-square rounded-md mb-1 border border-border hover:ring-2 hover:ring-primary/50 transition-all dark:border-gray-700"
                    style={{ backgroundColor: color.color }}
                    onClick={() => copyColorToClipboard(color.color)}
                    title={`Copy ${color.color}`}
                  ></button>
                  <p className="text-xs font-mono">{color.color}</p>
                  <p className="text-xs text-muted-foreground">{color.name}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 border dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4">CSS Variables</h3>
            <div className="relative">
              <div className="p-4 bg-muted/30 rounded-md font-mono text-sm overflow-x-auto whitespace-pre border dark:border-gray-700">
                {cssCode}
              </div>
              <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={copyToClipboard}>
                <Clipboard className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
