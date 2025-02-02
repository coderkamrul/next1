"use client";

import { useState, useEffect } from "react";
import { StarIcon, ArrowRight, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import InfiniteCarousel from "@/components/ui/infiniteCarousel";
import { Input } from "@/components/ui/input";

const GigCard = ({ gig }) => {
  return (
    <div className="rounded-lg dark:bg-gray-800 dark:border-gray-700 border shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col h-full">
      <div className="relative">
        <InfiniteCarousel slides={gig.images} nav="false" />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center mb-2">
          <Image
            src={gig.userId.profilePicture || "/placeholder.svg"}
            alt={gig.userId.name}
            width={24}
            height={24}
            className="rounded-full w-12 object-cover h-12 mr-2 border border-zinc-100"
          />
          <span className="text-sm font-semibold">{gig.userId.name}</span>
          <span
            className="ml-auto text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full"
            style={{ width: "60px", whiteSpace: "nowrap", textAlign: "center" }}
          >
            Level 2
          </span>
        </div>
        <Link href={`/services/${gig._id}`} className="block">
          <h3 className="text-sm font-semibold mb-2 flex-grow line-clamp-2 hover:underline">
            {gig.title}
          </h3>
        </Link>
        <div className="flex items-center text-sm text-yellow-500 mb-2">
          <StarIcon className="w-4 h-4 fill-current" />
          <span className="ml-1 font-semibold">{gig.rating}</span>
          <span className="ml-1 text-gray-400">({gig.reviewsCount})</span>
        </div>
      </div>
      <div className="px-4 py-2 border-t border-gray-200">
        <Link href={`/services/${gig._id}`} className="block">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Starting at
            </span>
            <span className="text-base font-bold hover:underline">
              ${gig.packages[0].price}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

const categories = [
  "web-development",
  "portfolio-websites",
  "business-websites",
  "landing-pages",
  "ecommerce-websites",
  "blogging-websites",
  "service-websites",
  "educational-websites",
  "nonprofit-websites",
  "event-booking-websites",
  "classifieds-websites",
];

export default function GigsPage() {
  const [gigs, setGigs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);
  const [category, setCategory] = useState("all");

  useEffect(() => {
    fetch("/api/gigs")
      .then((res) => res.json())
      .then((data) => setGigs(data.data));
  }, []);

  const toggleFilter = (filter) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const clearFilters = () => {
    setActiveFilters([]);
    setSearchQuery("");
  };

  const filteredGigs = gigs.filter((gig) => {
    const matchesCategory = category === "all" || gig.category === category;
    const matchesSearchQuery =
      gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gig.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gig.subcategory.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesActiveFilters =
      activeFilters.length === 0 || activeFilters.includes(gig.category);
    return matchesCategory && matchesSearchQuery && matchesActiveFilters;
  });

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto py-4">
        <div className="bg-slate-900 bg-no-repeat bg-cover bg-center py-12 px-4 mb-8 rounded-lg mx-4">
          <div className="container mx-auto max-w-7xl text-center">
            <h1 className="text-3xl font-bold mb-2 text-white">My Services</h1>
            <p className="mb-4 text-white">
              I provide a variety of services to help you with your next
              project.
            </p>
            <Link href="/client">
              <Button className="" variant="default">
                Client Reviews
                <ArrowRight className="mr-2" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="mb-8 mx-4">
          <div className="flex justify-between items-center">
            <div className="relative mb-4 w-full max-w-lg">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            {(activeFilters.length > 0 || searchQuery) && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="ml-2 mb-4"
              >
                <X className="h-4 w-4 mr-1" />
                Clear Filters
              </Button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex flex-wrap gap-2">
              {categories.map((filter) => (
                <Button
                  key={filter}
                  variant={
                    activeFilters.includes(filter) ? "default" : "outline"
                  }
                  className="cursor-pointer flex-grow"
                  onClick={() => toggleFilter(filter)}
                >
                  {filter
                    .replace(/-/g, " ")
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <main className="mx-4">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredGigs.map((gig) => (
                <GigCard key={gig._id} gig={gig} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

