"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";

const useInterval = (callback, delay) => {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => savedCallback.current(), delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

const InfiniteCarousel = ({ slides, autoplayInterval = 3000, nav }) => {
  const [api, setApi] = useState(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  useInterval(
    () => {
      api?.scrollTo(api.selectedScrollSnap() + 1);
    },
    autoplay ? autoplayInterval : null,
  );

  const handleMouseEnter = useCallback(() => {
    setAutoplay(false);
    setShowControls(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setAutoplay(true);
    setShowControls(false);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setShowControls(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initialize on component mount

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className="relative w-full max-w-4xl mx-auto"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Carousel
        setApi={setApi}
        className="w-full border-zinc-100 border rounded-lg overflow-hidden"
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index}>
              <Card className="border-none">
                <CardContent className="flex aspect-video !p-0 items-center justify-center">
                  <img src={slide} className="w-full h-full object-cover" alt="" />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        {showControls && (
          <>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
          </>
        )}
      </Carousel>
      {nav === "true" && (
        
      <div className="flex items-center justify-start space-x-2 py-2 text-sm text-muted-foreground">
        {slides.map((slide, index) => (
          <button
            key={index}
            className={`border bg-transparent rounded-sm w-16 h-16 overflow-hidden ${
              current - 1 === index ? "" : "opacity-50"
            }`}
            onClick={() => api?.scrollTo(index)}
          >
            <Image src={slide} width={300} height={200} alt="" className="p-1 object-cover w-full h-full" />
          </button>
        ))}
      </div>
      )}
    </div>
  );
};

export default InfiniteCarousel;

