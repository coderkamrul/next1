"use client";

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import useEmblaCarousel from "embla-carousel-react"

export function CustomCarousel({ testimonials }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: testimonials.length > 3,
    skipSnaps: false,
  })

  const [prevBtnDisabled, setPrevBtnDisabled] = React.useState(true)
  const [nextBtnDisabled, setNextBtnDisabled] = React.useState(false)
  const [isHovered, setIsHovered] = React.useState(false)

  const scrollPrev = React.useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = React.useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])

  const onSelect = React.useCallback(() => {
    if (!emblaApi) return
    setPrevBtnDisabled(!emblaApi.canScrollPrev())
    setNextBtnDisabled(!emblaApi.canScrollNext())
  }, [emblaApi])

  React.useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
    const interval = setInterval(() => emblaApi && !isHovered && emblaApi.scrollNext(), 3000);
    return () => clearInterval(interval);
  }, [emblaApi, onSelect, isHovered])

  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => setIsHovered(false)

  if (testimonials.length <= 3) {
    return <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{testimonials}</div>
  }

  return (
    <div className="relative " onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="absolute right-0 top-[-3rem] space-x-2 z-10">
        <Button variant="outline" size="icon" className="h-8 w-8" disabled={prevBtnDisabled} onClick={scrollPrev}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="h-8 w-8" disabled={nextBtnDisabled} onClick={scrollNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="pl-4 md:min-w-[40%] lg:min-w-[30%] sm:min-w-[50%] min-w-[80%] grid grid-cols-1">
              {testimonial}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}



