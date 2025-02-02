"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

import Link from "next/link";
import GigCard from "./GigCard";

function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function GigSkeleton() {
  return (
    <Card className="group relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
      <CardContent className="p-0">
        <div className="relative overflow-hidden">
          <div className="w-full h-36 bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="flex flex-col p-4">
            <div className="flex justify-between items-center w-full">
              <div className="h-6 w-2/3 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
            </div>
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 animate-pulse rounded mt-2" />
            <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mt-1" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="h-fit w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-0">
        <div className="flex items-center w-full justify-between !px-3 !py-2">
          <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
          <div className="flex gap-3">
            <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full" />
            <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full" />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export default function ViewServices() {
  const [displayedGigs, setDisplayedGigs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshGigs = async () => {
    const res = await fetch("/api/gigs");
    const data = await res.json();
    setIsLoading(true);
    setTimeout(() => {
      const shuffled = shuffleArray(data.data);
      const selected = shuffled.slice(0, 8);
      setDisplayedGigs(selected);
      setIsLoading(false);
    }, 500); // Simulate loading delay
  };

  useEffect(() => {
    refreshGigs();
  }, []);

  return (
    <section className="py-3 md:px-0 px-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-semibold text-primary mb-2"
          >
            View Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 dark:text-gray-400 text-sm sm:text-base"
          >
            All Services have been created from scratch.
          </motion.p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/services"
            className="text-gray-600 hover:text-primary dark:text-white"
          >
            <Button variant="outline">
              View All
              <motion.div
                animate={{ x: [0, 1.5, -1.5, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "linear",
                }}
                className="ml-2 h-4 w-4"
              >
                <ExternalLink />
              </motion.div>
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={refreshGigs}
            disabled={isLoading}
            className="p-3 hover:animate-[spin_0.3s_ease-in-out_forwards] transition-all duration-100 ease-in-out"
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {isLoading
          ? Array(8)
              .fill(0)
              .map((_, index) => (
                <motion.div
                  key={`skeleton-${index}`}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 },
                  }}
                >
                  <GigSkeleton />
                </motion.div>
              ))
          : displayedGigs.map((gig) => (
              <motion.div
                key={gig._id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
              >
                <GigCard gig={gig} />
              </motion.div>
            ))}
      </motion.div>

      {/* View More Gigs Button */}
      <motion.div
        className="flex justify-center mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Button
          variant="link"
          className="text-purple-600 text-lg font-medium hover:text-purple-700"
          asChild
        >
          <a href="/gigs">View More Services</a>
        </Button>
      </motion.div>
    </section>
  );
}

