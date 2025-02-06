"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import ImageUpload from "@/components/ImageUpload"
import Editor from "@/components/Editor"
import { Switch } from "@/components/ui/switch"

export default function EditCourseForm({ id }) {
  const [formData, setFormData] = useState({
    title: "",
    setupinstructions: "",
    image: "",
    category: "",
    level: "",
    status: "",
    paid: false,
    price: 0,
    duration: "",
    chapters: [
      {
        title: "",
        lectures: [
          {
            title: "",
            description: "",
            video: "",
            duration: 0,
            preview: false,
          },
        ],
      },
    ],
  })
  const router = useRouter()
  const [editorState, setEditorState] = useState("editor")
  const [textEditor, setTextEditor] = useState({ isReady: false })

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/course/${id}`)
        if (!res.ok) {
          throw new Error("Failed to fetch course")
        }
        const data = await res.json()
        setFormData(data.data)
      } catch (error) {
        console.error("Error:", error)
        toast({
          title: "Error",
          description: "Failed to fetch course. Please try again.",
          variant: "destructive",
        })
      }
    }
    fetchCourse()
  }, [id])

  useEffect(() => {
    if (!formData.paid) {
      setFormData((prevState) => ({
        ...prevState,
        chapters: prevState.chapters.map((chapter) => ({
          ...chapter,
          lectures: chapter.lectures.map((lecture) => ({
            ...lecture,
            preview: true,
          })),
        })),
      }))
    }
  }, [formData.paid])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleImageUpload = (imageUrl) => {
    setFormData((prevState) => ({
      ...prevState,
      image: imageUrl,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/course/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        router.push("/dashboard/course")
        toast({
          title: "Course updated",
          description: "Your course has been updated successfully.",
        })
      } else {
        throw new Error("Failed to update course")
      }
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "Failed to update course. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input type="text" name="title" id="title" required value={formData.title} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Editor
          setTextEditor={setTextEditor}
          setEditorState={setEditorState}
          formData={formData}
          setFormData={setFormData}
        />
      </div>
      <div>
        <Label htmlFor="description">Course Thumbnail</Label>
        <ImageUpload onImageUpload={handleImageUpload} />
        {formData.image && (
          <img src={formData.image || "/placeholder.svg"} alt="Course" className="mt-2 max-w-xs rounded-md" />
        )}
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Input type="text" name="category" id="category" value={formData.category} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="level">Level</Label>
        <select
          name="level"
          id="level"
          value={formData.level}
          onChange={handleChange}
          className="block w-full px-3 py-2 text-base text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm sm:leading-5"
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <select
          name="status"
          id="status"
          value={formData.status}
          onChange={handleChange}
          className="block w-full px-3 py-2 text-base text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm sm:leading-5"
        >
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="draft">Draft</option>
        </select>
      </div>
      <div className="flex items-center space-x-2">
        <Label htmlFor="paid">Paid</Label>
        <Switch
          checked={formData.paid}
          onCheckedChange={(value) =>
            setFormData((prevState) => ({
              ...prevState,
              paid: value,
              price: value ? prevState.price : 0,
            }))
          }
        />
      </div>
      {formData.paid && (
        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            type="number"
            name="price"
            id="price"
            value={formData.price}
            onChange={handleChange}
            min={0}
            step={1}
          />
        </div>
      )}
      <div>
        <Label htmlFor="duration">Duration</Label>
        <Input type="text" name="duration" id="duration" value={formData.duration} onChange={handleChange} />
      </div>
      <div className="space-y-4">
        <Label>Chapters</Label>
        {formData.chapters.map((chapter, chapterIndex) => (
          <div key={chapterIndex} className="space-y-2 shadow-lg border border-dashed border-zinc-400 p-4 rounded-md">
            <p className="text-sm text-gray-500">Chapter {chapterIndex + 1}</p>
            <div>
              <Label htmlFor={`chapter-title-${chapterIndex}`}>Title</Label>
              <Input
                type="text"
                name={`chapter-title-${chapterIndex}`}
                id={`chapter-title-${chapterIndex}`}
                value={chapter.title}
                onChange={(e) =>
                  setFormData((prevState) => ({
                    ...prevState,
                    chapters: prevState.chapters.map((c, i) =>
                      i === chapterIndex ? { ...c, title: e.target.value } : c,
                    ),
                  }))
                }
              />
            </div>
            <div>
              <Label>Lectures</Label>
              {chapter.lectures.map((lecture, lectureIndex) => (
                <div key={lectureIndex} className="space-y-2">
                  <p className="text-sm text-gray-500">Lecture {lectureIndex + 1}</p>
                  <div>
                    <Label htmlFor={`lecture-title-${chapterIndex}-${lectureIndex}`}>Title</Label>
                    <Input
                      type="text"
                      name={`lecture-title-${chapterIndex}-${lectureIndex}`}
                      id={`lecture-title-${chapterIndex}-${lectureIndex}`}
                      value={lecture.title}
                      onChange={(e) =>
                        setFormData((prevState) => ({
                          ...prevState,
                          chapters: prevState.chapters.map((c, i) =>
                            i === chapterIndex
                              ? {
                                  ...c,
                                  lectures: c.lectures.map((l, li) =>
                                    li === lectureIndex ? { ...l, title: e.target.value } : l,
                                  ),
                                }
                              : c,
                          ),
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor={`lecture-description-${chapterIndex}-${lectureIndex}`}>Description</Label>
                    <Textarea
                      name={`lecture-description-${chapterIndex}-${lectureIndex}`}
                      id={`lecture-description-${chapterIndex}-${lectureIndex}`}
                      value={lecture.description}
                      onChange={(e) =>
                        setFormData((prevState) => ({
                          ...prevState,
                          chapters: prevState.chapters.map((c, i) =>
                            i === chapterIndex
                              ? {
                                  ...c,
                                  lectures: c.lectures.map((l, li) =>
                                    li === lectureIndex ? { ...l, description: e.target.value } : l,
                                  ),
                                }
                              : c,
                          ),
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor={`lecture-video-${chapterIndex}-${lectureIndex}`}>Video</Label>
                    <Input
                      type="url"
                      name={`lecture-video-${chapterIndex}-${lectureIndex}`}
                      id={`lecture-video-${chapterIndex}-${lectureIndex}`}
                      value={lecture.video}
                      onChange={(e) =>
                        setFormData((prevState) => ({
                          ...prevState,
                          chapters: prevState.chapters.map((c, i) =>
                            i === chapterIndex
                              ? {
                                  ...c,
                                  lectures: c.lectures.map((l, li) =>
                                    li === lectureIndex ? { ...l, video: e.target.value } : l,
                                  ),
                                }
                              : c,
                          ),
                        }))
                      }
                    />
                    {lecture.video && (
                      <div className="mt-4 flex w-full items-center ">
                        <iframe
                          src={`https://www.youtube.com/embed/${lecture.video.includes("youtu.be") ? lecture.video.split("/").pop() : new URLSearchParams(new URL(lecture.video).search).get("v")}`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="h-[360px] w-[640px] rounded"
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor={`lecture-duration-${chapterIndex}-${lectureIndex}`}>Duration</Label>
                    <Input
                      type="number"
                      name={`lecture-duration-${chapterIndex}-${lectureIndex}`}
                      id={`lecture-duration-${chapterIndex}-${lectureIndex}`}
                      value={lecture.duration}
                      onChange={(e) =>
                        setFormData((prevState) => ({
                          ...prevState,
                          chapters: prevState.chapters.map((c, i) =>
                            i === chapterIndex
                              ? {
                                  ...c,
                                  lectures: c.lectures.map((l, li) =>
                                    li === lectureIndex
                                      ? {
                                          ...l,
                                          duration: Number.parseInt(e.target.value, 10),
                                        }
                                      : l,
                                  ),
                                }
                              : c,
                          ),
                        }))
                      }
                    />
                  </div>
                  {formData.paid && (
                    <div className="mt-4 flex items-center">
                      <span className="mr-2">Preview</span>
                      <Switch
                        checked={lecture.preview}
                        onCheckedChange={(value) =>
                          setFormData((prevState) => ({
                            ...prevState,
                            chapters: prevState.chapters.map((c, i) =>
                              i === chapterIndex
                                ? {
                                    ...c,
                                    lectures: c.lectures.map((l, li) =>
                                      li === lectureIndex
                                        ? { ...l, preview: value }
                                        : l
                                    ),
                                  }
                                : c
                          ),
                        }))
                      }
                    />
                  </div>
                  )}
                  <div className="mt-4 flex justify-end">
                    <Button
                      type="button"
                      onClick={() =>
                        setFormData((prevState) => ({
                          ...prevState,
                          chapters: prevState.chapters.map((c, i) =>
                            i === chapterIndex
                              ? {
                                  ...c,
                                  lectures: c.lectures.filter((_, li) => li !== lectureIndex),
                                }
                              : c,
                          ),
                        }))
                      }
                    >
                      Remove Lecture
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                onClick={() =>
                  setFormData((prevState) => ({
                    ...prevState,
                    chapters: prevState.chapters.map((c, i) =>
                      i === chapterIndex
                        ? {
                            ...c,
                            lectures: [
                              ...c.lectures,
                              {
                                title: "",
                                description: "",
                                video: "",
                                duration: 0,
                                preview: false,
                              },
                            ],
                          }
                        : c,
                    ),
                  }))
                }
              >
                Add Lecture
              </Button>
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                type="button"
                onClick={() =>
                  setFormData((prevState) => ({
                    ...prevState,
                    chapters: prevState.chapters.filter((_, i) => i !== chapterIndex),
                  }))
                }
              >
                Remove Chapter
              </Button>
            </div>
          </div>
        ))}
        <Button
          type="button"
          onClick={() =>
            setFormData((prevState) => ({
              ...prevState,
              chapters: [
                ...prevState.chapters,
                {
                  title: "",
                  lectures: [
                    {
                      title: "",
                      description: "",
                      video: "",
                      duration: 0,
                      preview: false,
                    },
                  ],
                },
              ],
            }))
          }
        >
          Add Chapter
        </Button>
      </div>
      <Button type="submit">Update Course</Button>
    </form>
  )
}

