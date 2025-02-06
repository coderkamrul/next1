"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Book, Calendar, CirclePause, CirclePlay, Clock, GraduationCap, Lock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AccessCode from "@/components/AccessCode";
import { toast } from "@/hooks/use-toast";
import useAddCopyButtons from "@/hooks/useAddCopyButtons";
import InstructionBlock from "@/components/InstructionBlock";
import { useSession } from "next-auth/react";
import Cta from "@/components/Cta";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Enroll from "@/components/Enroll";

export default function CourseDetailsPage({ params }) {
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const { data: session } = useSession();

  useEffect(() => {
    fetchCourse();
  }, []);

  useAddCopyButtons();

  const fetchCourse = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/course/all/${params.id}`);
      if (!res.ok) {
        throw new Error("Failed to fetch course");
      }
      const data = await res.json();
      if (data.success) {
        setCourse(data.data);
        // Set the first preview lecture as the default selected lecture
        const firstPreviewLecture = data.data.chapters
          .flatMap((chapter) => chapter.lectures)
          .find((lecture) => lecture.preview);
        setSelectedLecture(firstPreviewLecture || null);
        setSelectedChapter(
          firstPreviewLecture
            ? data.data.chapters.find((chapter) =>
                chapter.lectures.includes(firstPreviewLecture)
              )
            : null
        );
      } else {
        throw new Error(data.error || "Failed to fetch course");
      }
    } catch (err) {
      setError(err.message || String(err));
      toast({
        title: "Error",
        description: err.message || String(err),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-5 w-5 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex justify-center items-center h-screen">
        Course not found
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto md:p-4">
      <div className="lg:grid lg:grid-cols-[400px,1fr] gap-8">
        {/* Sticky Sidebar */}
        <div className="lg:sticky lg:top-20 lg:h-fit space-y-8 p-4 lg:p-0">
          <Link
            href="/courses"
            className="inline-flex items-center text-base text-muted-foreground hover:text-foreground mb-2 md:mb-6 md:px-4 lg:px-0"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go back to Courses
          </Link>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {course.title}
                </h3>
                {course.paid && (
                  <p className="text-base font-semibold text-primary">
                    Price: ${course.price}
                  </p>
                )}
              </div>
              <div className="flex justify-between items-center">
                <Badge className="text-sm" variant="outline">
                  {course.category}
                </Badge>
                <Badge
                  variant="outline"
                  className={`text-sm font-normal ${
                    course.level === "beginner"
                      ? "bg-green-100 text-green-800"
                      : course.level === "intermediate"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {course.level}
                </Badge>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-base text-muted-foreground">
                Duration: {course.duration}
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            {course.chapters.every((chapter) =>
              chapter.lectures.every((lecture) => lecture.preview)
            ) ? (
              <Button
                className="w-full"
                variant="default"
                disabled
                title="All lectures are preview-only"
              >
                This course is already enrolled
              </Button>
            ) : (
              <Enroll course={course} />
            )}
            <Link href="/courses" rel="noopener noreferrer">
              <Button className="w-full" variant="outline">
                See More
              </Button>
            </Link>
          </div>
          <h3 className="text-xl font-semibold text-foreground">
            Chapters{" "}
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <Book className="w-4 h-4" />
              {course.totalChapters} Chapters, {course.totalLectures} Lectures
            </div>
          </h3>
          <ScrollArea className="h-[calc(100vh-30rem)]">
            <Accordion
              type="single"
              collapsible
              className="w-full"
              defaultValue={`chapter-0`}
            >
              {course.chapters.map((chapter, chapterIndex) => (
                <AccordionItem
                  value={`chapter-${chapterIndex}`}
                  key={chapter._id}
                >
                  <AccordionTrigger className="text-base text-foreground hover:bg-zinc-100 font-medium bg-zinc-50 dark:bg-zinc-800 px-2">
                    <div className="flex items-center space-x-2">
                      <span className="rounded-full w-8 h-8 border flex items-center justify-center">
                        {chapterIndex + 1}
                      </span>
                      <GraduationCap className="h-4 w-4 ml-2" />
                      <span>{chapter.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="ml-4 mt-2 space-y-2">
                      {chapter.lectures.map((lecture, lectureIndex) => {
                        const isActive = selectedLecture?._id === lecture._id;
                        const isPreview = lecture.preview;
                        const lectureClassNames = `
                          text-sm transition-colors duration-200  cursor-pointer
                          ${isActive ? "bg-primary/20" : ""}
                          ${isPreview ? "hover:text-primary" : "text-muted-foreground opacity-70 cursor-not-allowed"}
                        `;

                        return (
                          <li
                            key={lecture._id}
                            className={`
                              ${lectureClassNames}
                              list-none border-l-2 p-2 mr-2 
                              ${
                                isActive
                                  ? "border-primary/50 text-primary "
                                  : "border-transparent "
                              }
                            `}
                            onClick={() =>
                              isPreview
                                ? (setSelectedLecture(lecture),
                                  setSelectedChapter(chapter))
                                : null
                            }
                          >
                            <div className="flex items-center space-x-2">
                              <span>{lectureIndex + 1}</span>
                              <span>{lecture.title}</span>
                              <span className="text-xs font-light">
                                ({lecture.duration} min)
                              </span>
                              {isActive ? (
                                <CirclePause className="inline-block ml-2 h-4 w-4"/>
                              ):(
                                <CirclePlay className="inline-block ml-2 h-4 w-4 text-muted-foreground"/>
                              )}
                              {!isPreview && (
                                <Lock className="inline-block ml-2 h-4 w-4" />
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollArea>
        </div>

        {/* Scrollable Content */}
        <div className="space-y-8 py-4 md:px-8 md:border-l">
          {selectedLecture ? (
            <div className="mt-4 flex w-full items-center">
              {selectedLecture.preview ? (
                <iframe
                  src={`https://www.youtube.com/embed/${
                    selectedLecture.video.includes("youtu.be")
                      ? selectedLecture.video.split("/").pop()
                      : new URLSearchParams(
                          new URL(selectedLecture.video).search
                        ).get("v")
                  }`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-[400px] rounded"
                />
              ) : (
                <div className="w-full h-[400px] bg-muted flex items-center justify-center rounded">
                  <p className="text-center text-muted-foreground">
                    This lecture is paid content. You need to enroll first to
                    view this lecture.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-[400px] bg-muted flex items-center justify-center rounded">
              <img
                src={
                  course?.image ||
                  "https://res.cloudinary.com/abdulhadi/image/upload/v1646501559/lecture_placeholder_xqzqjy.png"
                }
                alt={course?.title || "Lecture Placeholder"}
                className="w-full h-full object-contain"
              />
            </div>
          )}

          <div className="space-y-2 mb-8 p-6 md:p-4 rounded shadow-lg">
            <div className="flex gap-2 justify-between items-center">
              <h4 className="text-lg font-semibold text-foreground">
                {selectedLecture?.title}
              </h4>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <p className="text-sm text-muted-foreground">
                  Duration: {selectedLecture?.duration} min
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {new Date(selectedLecture?.createdAt).toLocaleString()}
            </p>
            <p className="text-base text-muted-foreground">
              {selectedLecture?.description}
            </p>
          </div>
          <div className=" p-2">
            <div className="">
              <h3 className="text-lg font-semibold mb-2">Course Details</h3>
              {course.setupinstructions[0].blocks.map((instruction, index) => (
                <InstructionBlock key={index} instruction={instruction} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Cta />
    </div>
  );
}
