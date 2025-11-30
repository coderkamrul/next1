"use client";

import { useState, useEffect } from "react";
import { StarIcon, ArrowRight, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import InfiniteCarousel from "@/components/ui/infiniteCarousel";
import { Input } from "@/components/ui/input";

export default function AffiliatePage() {
  const [affiliates, setAffiliates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);
  const [category, setCategory] = useState("all");

  useEffect(() => {
    fetch("/api/affiliates")
      .then((res) => res.json())
      .then((data) => {
        setAffiliates(data.data);
        const uniqueCategories = Array.from(
          new Set(data.data.map((affiliate) => affiliate.affiliateCategory))
        );
        setCategories(uniqueCategories);
      });
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

  const filteredAffiliates = affiliates.filter((affiliate) => {
    const matchesCategory =
      category === "all" || affiliate.affiliateCategory === category;
    const matchesSearchQuery =
      affiliate.affiliateName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      affiliate.affiliateDescription
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      affiliate.userId.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesActiveFilters =
      activeFilters.length === 0 ||
      activeFilters.includes(affiliate.affiliateCategory);
    const isActive = affiliate.isActive;
    return matchesCategory && matchesSearchQuery && matchesActiveFilters && isActive;
  });

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto py-4">
        <div className="bg-slate-900 bg-no-repeat bg-cover bg-center py-12 px-4 mb-8 rounded-lg mx-4">
          <div className="container mx-auto max-w-7xl text-center">
            <h1 className="text-3xl font-bold mb-2 text-white">
              Top Rated Services Used by Our Community
            </h1>
            <p className="mb-4 text-gray-200">
              Our community has carefully curated the best services for you to
              use.
            </p>
            {/* <Link href="/affiliate">
              <Button className="" variant="default">
                Explore Services
                <ArrowRight className="mr-2" />
              </Button>
            </Link> */}
          </div>
        </div>

        <div className="mb-8 mx-4">
          <div className="flex justify-between items-center">
            <div className="relative mb-4 w-full max-w-lg">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search services..."
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
              {filteredAffiliates.map((affiliate) => (
                <Link
                  href={affiliate.affiliateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={affiliate._id}
                  className="rounded-lg dark:bg-gray-800 dark:border-gray-700 border shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col h-full"
                >
                  <div className="relative">
                    <Image
                      src={affiliate.affiliateImage}
                      alt={affiliate.affiliateName}
                      width={300}
                      height={200}
                      className="object-cover w-full aspect-video"
                    />
                    {/* <InfiniteCarousel
                      slides={affiliate.images}
                      nav="false"
                    /> */}
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="flex items-center mb-2">
                      <Image
                        src={affiliate.profileImage || "/placeholder.svg"}
                        alt={affiliate.affiliateName}
                        width={24}
                        height={24}
                        className="rounded-full w-12 object-cover h-12 mr-2 border border-zinc-100"
                      />
                      <span className="text-sm font-semibold">
                        {affiliate.affiliateName}
                      </span>
                      <span className="ml-auto text-xs bg-gray-200/40 text-gray-700 px-3 py-1 rounded-full">
                        <div className="flex items-center text-sm text-yellow-500 ">
                          <StarIcon className="w-4 h-4 fill-current" />
                          <span className="ml-1 font-semibold">
                            {/* {affiliate.clicks} */}5
                          </span>
                        </div>
                      </span>
                    </div>
                    <Link
                      href={affiliate.affiliateLink}
                      className="flex flex-col justify-between h-full"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <h3 className="text-sm font-semibold mb-2 flex-grow line-clamp-2 hover:underline">
                        {affiliate.affiliateDescription}
                      </h3>
                    <div className="flex items-center text-[12px] text-gray-400 italic ">
                      {affiliate.affiliateCategory}
                    </div>
                    </Link>
                  </div>
                  <div className="px-4 py-2 border-t border-gray-200">
                    <Link
                      href={affiliate.affiliateLink}
                      className="block"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Starting at
                        </span>
                        <span className="text-base font-bold hover:underline">
                          ${affiliate.price}
                        </span>
                      </div>
                    </Link>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
