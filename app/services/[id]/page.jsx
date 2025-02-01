"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  StarIcon,
  CheckCircle,
  Clock,
  RefreshCcw,
  Heart,
  ChevronLeftCircle,
} from "lucide-react";
import Image from "next/image";
import InfiniteCarousel from "@/components/ui/infiniteCarousel";
import Link from "next/link";
import EmailMe from "@/components/Emailme";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import OrderForm from "@/components/OrderForm";
import { useSession } from 'next-auth/react';




const GigDetails = ({ params }) => {
  const { id } = React.use(params);
  const { data: session, status } = useSession();

  const [currentPackage, setCurrentPackage] = useState(0);
  const [gig, setGig] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  React.useEffect(() => {
    const fetchGig = async () => {
      const response = await fetch(`/api/gigs/${id}`);
      const data = await response.json();

      setGig(data.data);
    };
    fetchGig();
  }, [id]);

  const handleSuccess = () => {
    setIsOpen(false);
  };

  if (!gig) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        Gig not found
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="overflow-hidden mb-8">
              <Button variant="outline" className="m-4">
                <Link href="/services" className="inline-flex items-center">
                  <ChevronLeftCircle className="w-4 h-4 mr-2" />
                  Go Back
                </Link>
              </Button>
              <div className="p-6">
                <p className="text-sm text-gray-500 dark:text-gray-400 pb-2">
                  {gig.category} / {gig.subcategory}
                </p>

                <h1 className="text-2xl font-bold mb-4">{gig.title}</h1>
                <div className="flex items-center mb-4">
                  <Image
                    src={gig.userId.profilePicture || "/placeholder.svg"}
                    alt={gig.userId.name}
                    width={40}
                    height={40}
                    className="rounded-full mr-2"
                  />
                  <div>
                    <span className="font-semibold">{gig.userId.name}</span>
                    <div className="flex items-center text-sm text-yellow-500">
                      <StarIcon className="w-4 h-4 fill-current" />
                      <span className="ml-1 font-semibold">{gig.rating}</span>
                      <span className="ml-1 text-gray-400">
                        ({gig.reviewsCount})
                      </span>
                    </div>
                  </div>
                  <span className="ml-auto text-sm bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                    Level 2
                  </span>
                </div>
                <div className="relative">
                  <InfiniteCarousel slides={gig.images} nav="true" />
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 block lg:hidden">
              <div className="bg-white shadow-md border border-zinc-200 rounded-lg overflow-hidden sticky top-20">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold dark:text-black">
                      Packages
                    </h2>
                    <button className="text-gray-500 hover:text-gray-700">
                      <Heart className="w-6 h-6 fill-red-600 text-red-600" />
                    </button>
                  </div>
                  <div className="flex border-b mb-4">
                    {gig.packages.map((pkg, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPackage(index)}
                        className={`flex-1 text-center py-2 ${
                          index === currentPackage
                            ? "border-b-2 border-green-500 text-green-500"
                            : "text-gray-500"
                        }`}
                      >
                        {pkg.name}
                      </button>
                    ))}
                  </div>
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold mb-2 ">
                      ${gig.packages[currentPackage].price}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {gig.packages[currentPackage].title}
                    </p>
                    <div className="text-sm text-gray-600 mb-4 ">
                      <div className="flex items-center mb-2">
                        <Clock className="w-4 h-4 mr-2" />
                        {gig.packages[currentPackage].deliveryTime} Days
                        Delivery
                      </div>
                      <div className="flex items-center mb-2">
                        <RefreshCcw className="w-4 h-4 mr-2" />
                        {gig.packages[currentPackage].revisions} Revision
                        {gig.packages[currentPackage].revisions > 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                  <ul className="text-sm text-gray-600 mb-4">
                    {gig.packages[currentPackage].features.map(
                      (feature, index) => (
                        <li key={index} className="flex items-center mb-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          {feature}
                        </li>
                      )
                    )}
                  </ul>
                  <Drawer>
                    <DrawerTrigger asChild>
                      <Button variant="darkAnimated" className="w-full mb-2">
                        Continue (${gig.packages[currentPackage].price})
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent className="sm:max-w-lg px-4 pb-8">
                      <DrawerHeader>
                        <DrawerTitle>Get in touch</DrawerTitle>
                        <p className="text-sm text-muted-foreground">
                          Let's discuss your web development needs
                        </p>
                      </DrawerHeader>
                      <OrderForm
                        packageDetails={gig.packages[currentPackage]}
                        requirements={gig.requirements}
                        gig={gig}
                      />
                    </DrawerContent>
                  </Drawer>
                  <EmailMe text="Contact Seller" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-700 shadow-md rounded-lg overflow-hidden mb-8">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">About This Gig</h2>
                <p className="text-gray-600 mb-6 dark:text-gray-200">
                  {gig.description}
                </p>
                <h3 className="text-lg font-semibold mb-2">About The Seller</h3>
                <p className="text-gray-600 mb-4 dark:text-gray-200">
                  {gig.seller.description}
                </p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-700 shadow-md rounded-lg overflow-hidden mb-8">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Compare Packages</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr>
                        <th className="border p-2 bg-gray-100 dark:bg-gray-700"></th>
                        {gig.packages.map((pkg, index) => (
                          <th
                            key={index}
                            className="border p-2 dark:bg-gray-700 bg-gray-100 text-center"
                          >
                            <div className="font-bold">{pkg.title}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                              {pkg.description}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border p-2 font-semibold">Price</td>
                        {gig.packages.map((pkg, index) => (
                          <td key={index} className="border p-2 text-center">
                            ${pkg.price}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="border p-2 font-semibold">
                          Delivery Time
                        </td>
                        {gig.packages.map((pkg, index) => (
                          <td key={index} className="border p-2 text-center">
                            {pkg.deliveryTime} days
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="border p-2 font-semibold">Revisions</td>
                        {gig.packages.map((pkg, index) => (
                          <td key={index} className="border p-2 text-center">
                            {pkg.revisions}
                          </td>
                        ))}
                      </tr>
                      {gig.packages
                        .flatMap((pkg) => pkg.features)
                        .map((feature, featureIndex) => (
                          <tr key={featureIndex}>
                            <td className="border p-2 font-semibold">
                              {feature}
                            </td>
                            {gig.packages.map((pkg, pkgIndex) => (
                              <td
                                key={pkgIndex}
                                className="border p-2 text-center"
                              >
                                {pkg.features.includes(feature) ? (
                                  <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                                ) : (
                                  <span className="text-gray-300">-</span>
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-700 shadow-md rounded-lg overflow-hidden mb-8">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">What's Included</h2>
                <ul className="list-none mb-6">
                  {gig.packages
                    .flatMap((pkg) => pkg.features)
                    .map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center text-gray-600 mb-2 dark:text-gray-300"
                      >
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
            <div className=" shadow-md rounded-lg overflow-hidden dark:bg-gray-700">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Reviews</h2>
                {gig.reviews &&
                  gig.reviews.map((review) => (
                    <div
                      key={review._id}
                      className="mb-4 pb-4 border-b border-gray-200 last:border-b-0"
                    >
                      <div className="flex items-center mb-2">
                        <span className="font-semibold mr-2">
                          {review.user}
                        </span>
                        <div className="flex items-center text-yellow-500">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? "fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                          {review.date}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">
                        {review.comment}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-1 hidden lg:block ">
            {gig.userId._id === session?.user?.id && (
              <Link href={`/dashboard/gig/${gig._id}/edit`}>
                <Button variant="default" className="mb-4">
                  Edit
                </Button>
              </Link>
            )}
            <div className="bg-white shadow-md border border-zinc-100 rounded-lg overflow-hidden sticky top-20">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold dark:text-black">
                    Packages
                  </h2>
                  <button className="text-gray-500 hover:text-gray-700">
                    <Heart className="w-6 h-6 fill-red-600 text-red-600" />
                  </button>
                </div>
                <div className="flex border-b mb-4">
                  {gig.packages.map((pkg, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPackage(index)}
                      className={`flex-1 text-center py-2 ${
                        index === currentPackage
                          ? "border-b-2 border-green-500 text-green-500"
                          : "text-gray-500"
                      }`}
                    >
                      {pkg.name}
                    </button>
                  ))}
                </div>
                <div className="mb-4">
                  <h3 className="text-2xl font-bold mb-2 dark:text-black">
                    ${gig.packages[currentPackage].price}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {gig.packages[currentPackage].title}
                  </p>
                  <div className="text-sm text-gray-600 mb-4">
                    <div className="flex items-center mb-2">
                      <Clock className="w-4 h-4 mr-2" />
                      {gig.packages[currentPackage].deliveryTime} Days Delivery
                    </div>
                    <div className="flex items-center mb-2">
                      <RefreshCcw className="w-4 h-4 mr-2" />
                      {gig.packages[currentPackage].revisions} Revision
                      {gig.packages[currentPackage].revisions > 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
                <ul className="text-sm text-gray-600 mb-4">
                  {gig.packages[currentPackage].features.map(
                    (feature, index) => (
                      <li key={index} className="flex items-center mb-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        {feature}
                      </li>
                    )
                  )}
                </ul>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="darkAnimated"
                      className="w-full mb-2"
                      onClick={() => setIsOpen(true)}
                    >
                      Continue (${gig.packages[currentPackage].price})
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Get in touch</DialogTitle>
                      <p className="text-sm text-muted-foreground">
                        Let's discuss your web development needs
                      </p>
                    </DialogHeader>
                    <OrderForm
                      packageDetails={gig.packages[currentPackage]}
                      requirements={gig.requirements}
                      gig={gig}
                      onSuccess={handleSuccess}
                    />
                  </DialogContent>
                </Dialog>
                <EmailMe text="Contact Seller" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GigDetails;
