import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import ImageUpload from "@/components/ImageUpload"
import { X } from "lucide-react"

export default function GalleryForm({ onNext, onBack, data }) {
  const [images, setImages] = useState(data.images || [""])
  const [newImages, setNewImages] = useState([])

  const handleImageUpload = (imageUrl) => {
    setNewImages((prevState) => [...prevState, imageUrl])
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const filledImages = [...images, ...newImages].filter((img) => img.trim() !== "")
    if (filledImages.length > 0) {
      onNext({ images: filledImages })
    } else {
      alert("Please add at least one image before proceeding.")
    }
  }

  const allImages = [...images, ...newImages].filter((img) => img.trim() !== "")

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label>Gig Images</Label>

        <ImageUpload onImageUpload={handleImageUpload} />
        <div className="flex gap-4 mt-4">
          {allImages.length > 0 &&
            allImages.map((imageUrl, index) => (
              <div key={index} className="relative rounded overflow-hidden h-24 w-24">
                <img src={imageUrl} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  className="absolute top-0 right-0 p-2 text-white bg-black rounded-full hover:bg-gray-800"
                  onClick={() =>
                    setImages((prevState) =>
                      prevState.filter((_, i) => i !== index)
                    )
                  }
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
        </div>
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

