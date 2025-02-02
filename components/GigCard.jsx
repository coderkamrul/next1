"use client";

import { StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import InfiniteCarousel from "@/components/ui/infiniteCarousel";

export default function GigCard({ gig }) {
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
}
