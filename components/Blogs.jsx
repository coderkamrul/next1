"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github, Search, X, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";

function BlogSkeleton() {
  return (
    <Card className="group relative overflow-hidden rounded-xl border">
      <CardContent className="p-0">
        <div className="relative overflow-hidden">
          <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="flex flex-col p-4">
            <div className="h-6 w-2/3 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 animate-pulse rounded mt-2" />
            <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mt-1" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t p-4">
        <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
      </CardFooter>
    </Card>
  );
}

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState([]);
  const blogsPerPage = 8;

  useEffect(() => {
    fetchBlogs();
  }, []);
  console.log(blogs);

  const fetchBlogs = async () => {
    const res = await fetch("/api/blogs/all");
    const data = await res.json();
    if (data.success) {
      setBlogs(data.data);
      setIsLoading(false);
      const tags = data.data.map((blog) => blog.tags).flat();
      const uniqueTags = Array.from(new Set(tags));
      setFilters(uniqueTags);
    }
  };

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilters =
      activeFilters.length === 0 ||
      activeFilters.some((filter) => blog.tags.includes(filter));
    return matchesSearch && matchesFilters;
  });

  const toggleFilter = (filter) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setActiveFilters([]);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const pageCount = Math.ceil(filteredBlogs.length / blogsPerPage);
  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * blogsPerPage,
    currentPage * blogsPerPage
  );

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <div className="bg-slate-900 text-white py-12 px-4 mb-8 rounded-lg mx-4">
        <div className="container mx-auto max-w-7xl text-center">
          <h1 className="text-3xl font-bold mb-2">The blogs I have written</h1>
          <p className="text-slate-400 mb-4">
            I write about my experiences and the things I learn.
          </p>
          <Button variant="default">
            <Youtube className="mr-2 h-4 w-4" />
            View Videos
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div className="relative mb-4 w-full max-w-lg">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search blogs..."
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
            {filters.map((filter) => (
              <Button
                key={filter}
                variant={activeFilters.includes(filter) ? "default" : "outline"}
                className="cursor-pointer flex-grow"
                onClick={() => toggleFilter(filter)}
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>

        {/* Blogs Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
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
                    <BlogSkeleton />
                  </motion.div>
                ))
            : paginatedBlogs.map((blog) => (
                <motion.div
                  key={blog._id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 },
                  }}
                >
                  <Card className="group overflow-hidden">
                    <CardContent className="p-0">
                      <Link href={`/blogs/${blog._id}`}>
                        <div className="relative">
                          <Image
                            src={blog.image}
                            alt={blog.title}
                            width={500}
                            height={300}
                            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="p-4">
                            <h3 className="font-semibold mb-2 group-hover:text-purple-600">
                              {blog.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {blog.description}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </CardContent>
                    <CardFooter className="border-t p-4 flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {blog.tags.length > 0 && (
                          <Badge
                            key={blog.tags[0]}
                            variant="outline"
                            className="mr-2"
                          >
                            {blog.tags[0]}
                          </Badge>
                        )}
                      </span>

                      <div>
                        <div>
                          <Link
                            href={`/blogs/${blog._id}`}

                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-primary"
                          >
                            <ExternalLink className="h-5 w-5 hover:scale-110" />
                          </Link>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
        </motion.div>

        {/* Pagination */}
        {!isLoading && pageCount > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </Button>
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              disabled={currentPage === pageCount}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
