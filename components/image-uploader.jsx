"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"

export default function ImageUploader({ onImagesSelected }) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedImages, setSelectedImages] = useState([])
  const inputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleChange = (e) => {
    e.preventDefault()

    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = (files) => {
    const validFiles = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, 10) // Limit to 10 images

    setSelectedImages(validFiles)
    onImagesSelected(validFiles)
  }

  const removeImage = (index) => {
    const newImages = [...selectedImages]
    newImages.splice(index, 1)
    setSelectedImages(newImages)
    onImagesSelected(newImages)
  }

  const openFileDialog = () => {
    inputRef.current.click()
  }

  return (
    <div>
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          dragActive ? "border-emerald-500 bg-emerald-50" : "border-gray-300"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input ref={inputRef} type="file" multiple accept="image/*" onChange={handleChange} className="hidden" />

        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">Drag and drop up to 10 images here or click to upload</p>
        <Button variant="outline" onClick={openFileDialog} className="mt-4">
          Select Images
        </Button>
      </div>

      {selectedImages.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Selected Images ({selectedImages.length})</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {selectedImages.map((file, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(file) || "/placeholder.svg"}
                  alt={file.name}
                  className="h-24 w-full object-cover rounded-md"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
                <p className="text-xs truncate mt-1">{file.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
