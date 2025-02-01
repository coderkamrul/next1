"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import TestimonialCard from "@/components/TestimonialCard";
import Cta from "@/components/Cta";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const page = () => {
  const [reviewdata, setreviewdata] = useState([]);
  const [allReviews, setAllReviews] = useState([]);

  const sceleton = [1, 2, 3, 4, 5,6 ,7, 8];
  const fetchReviews = async () => {
    const res = await fetch("/api/reviews");
    const data = await res.json();
    if (data.success) {
      setAllReviews(data.data);
      const sortedReviews = data.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setreviewdata(sortedReviews);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="py-4 max-w-7xl mx-auto overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 bg-no-repeat bg-cover bg-center py-12 px-4 mb-8 rounded-lg mx-4">
        <div className="container mx-auto max-w-7xl text-center">
          <h1 className="text-3xl font-bold mb-2 text-white">
            What My Client Says About Me
          </h1>
          <p className="mb-4 text-white">
            I am proud to have worked with many clients and here are some of the
            nice things they have said about me.
          </p>
          <Link href="/projects">
            <Button className="" variant="default">
              View Projects
              <ArrowRight className="mr-2" />
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-4 gap-4 gap-y-6">
          {reviewdata.length === 0 ? (
            sceleton.map((i) => (
              <Card key={i} className="w-[300px] overflow-hidden">
                <CardContent className="p-2">
                  <Skeleton className="w-full h-[200px] rounded-lg" />
                  <div className="pt-3 space-y-3">
                    <div className="space-y-4">
                      {/* Client Review Message Skeleton */}
                      <Skeleton className="h-[60px] w-[90%] rounded-2xl" />
                      {/* Reply Message Skeleton */}
                      <div className="flex justify-end">
                        <Skeleton className="h-[40px] w-[80%] rounded-2xl" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex flex-col gap-1">
                        <Skeleton className="h-4 w-[100px]" />
                        <Skeleton className="h-4 w-[60px]" />
                        </div>
                      </div>
                      <Skeleton className="h-9 w-9 rounded-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            reviewdata.map((testimonial) => (
              <TestimonialCard
                key={testimonial._id}
                imageUrl={testimonial.projectImage}
                clientReview={testimonial.review}
                reply={testimonial.reply}
                clientName={testimonial.name}
                projectUrl={testimonial.projectLink}
                avatarUrl={testimonial.profilePicture}
                star={testimonial.rating}
              />
            ))
          )}
        </div>
      </div>
      <Cta />
    </div>
  );
};

export default page;
