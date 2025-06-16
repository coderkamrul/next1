"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ImageUpload from "./ImageUpload";
import { Textarea } from "./ui/textarea";
import { SheetClose } from "./ui/sheet";
import { TrashIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Switch } from "./ui/switch";

export default function AddAffiliateForm({ closeSheet, fetchAffiliates }) {
  const [affiliate, setAffiliate] = useState({
    isActive: true,
    affiliateName: "",
    affiliateDescription: "",
    affiliateLink: "",
    affiliateImage: null,
    profileImage: null,
    affiliateCategory: "",
    price: "",
  });

  const [validationErrors, setValidationErrors] = useState({});

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) return;

    try {
      const response = await fetch("/api/affiliates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(affiliate),
      });
      console.log(response);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add affiliate");
    }

    fetchAffiliates();
    closeSheet();
  };

  const validateForm = () => {
    const errors = {};

    if (!affiliate.affiliateName) {
      errors.affiliateName = "Please enter an affiliate name";
    }

    if (!affiliate.affiliateDescription) {
      errors.affiliateDescription = "Please enter a description";
    }

    if (!affiliate.affiliateLink) {
      errors.affiliateLink = "Please enter an affiliate link";
    }

    if (!affiliate.affiliateImage) {
      errors.affiliateImage = "Please add an image";
    }
    if (!affiliate.profileImage) {
      errors.profileImage = "Please add a profile image";
    }

    if (!affiliate.affiliateCategory) {
      errors.affiliateCategory = "Please enter a category";
    }
    if (!affiliate.price) {
      errors.price = "Please enter a price";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const target = e.target;
    const value = target.value;
    const name = target.name;

    setAffiliate((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleImageUpload = (imageUrl) => {
    setAffiliate((prevState) => ({ ...prevState, affiliateImage: imageUrl }));
  };
  const handleProfileUpload = (imageUrl) => {
    setAffiliate((prevState) => ({ ...prevState, profileImage: imageUrl }));
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="flex gap-4 mt-12">
        <div className={`mb-4  ${!affiliate.profileImage ? "w-1/2" : "w-36"}`}>
          {!affiliate.profileImage && (
            <ImageUpload onImageUpload={handleProfileUpload} />
          )}
          {affiliate.profileImage ? (
            <div className="mt-2 flex items-center space-x-2 border border-dashed border-gray-300 rounded-md p-2 relative w-fit">
              <img
                src={affiliate.profileImage}
                alt="Affiliate Image"
                className="h-20 w-20 object-cover rounded-full"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setAffiliate((prevState) => ({
                    ...prevState,
                    profileImage: "",
                  }))
                }
                className="text-gray-500 absolute top-0 right-0 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <TrashIcon className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <p className="text-red-500 text-sm">
              {validationErrors.profileImage}
            </p>
          )}
        </div>

        <div className="mb-4 w-full">
          <div>
            <Label htmlFor="affiliateName">Profile Name</Label>
            <Input
              id="affiliateName"
              name="affiliateName"
              value={affiliate.affiliateName}
              onChange={handleInputChange}
              required
              className={validationErrors.affiliateName ? "border-red-500" : ""}
            />
            {validationErrors.affiliateName && (
              <p className="text-red-500 text-sm">
                {validationErrors.affiliateName}
              </p>
            )}
          </div>
          <div className="flex items-center mt-4">
            <Switch
              id="isActive"
              name="isActive"
              checked={affiliate.isActive}
              onCheckedChange={(checked) =>
                setAffiliate((prevState) => ({
                  ...prevState,
                  isActive: checked,
                }))
              }
            />
            <Label htmlFor="isActive" className="ml-2">
              Is Active
            </Label>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <Label htmlFor="affiliateDescription">Affiliate Title</Label>
        <Textarea
          id="affiliateDescription"
          name="affiliateDescription"
          value={affiliate.affiliateDescription}
          onChange={handleInputChange}
          required
          className={
            validationErrors.affiliateDescription ? "border-red-500" : ""
          }
        />
        {validationErrors.affiliateDescription && (
          <p className="text-red-500 text-sm">
            {validationErrors.affiliateDescription}
          </p>
        )}
      </div>

      <div className="mb-4">
        <Label htmlFor="affiliateLink">Affiliate Link</Label>
        <Input
          id="affiliateLink"
          name="affiliateLink"
          value={affiliate.affiliateLink}
          onChange={handleInputChange}
          required
          className={validationErrors.affiliateLink ? "border-red-500" : ""}
        />
        {validationErrors.affiliateLink && (
          <p className="text-red-500 text-sm">
            {validationErrors.affiliateLink}
          </p>
        )}
      </div>

      <div className="mb-4">
        <Label>Affiliate Image</Label>
        <ImageUpload onImageUpload={handleImageUpload} />
        {affiliate.affiliateImage ? (
          <div className="mt-2 flex items-center space-x-2 border border-dashed border-gray-300 rounded-md p-2 relative w-fit">
            <img
              src={affiliate.affiliateImage}
              alt="Affiliate Image"
              className="h-24 w-fit object-cover"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setAffiliate((prevState) => ({
                  ...prevState,
                  affiliateImage: "",
                }))
              }
              className="text-gray-500 absolute top-0 right-0 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <TrashIcon className="h-5 w-5" />
            </Button>
          </div>
        ) : (
          <p className="text-red-500 text-sm">
            {validationErrors.affiliateImage}
          </p>
        )}
      </div>

      <div className="mb-4">
        <Label htmlFor="affiliateCategory">Category</Label>
        <Input
          id="affiliateCategory"
          name="affiliateCategory"
          value={affiliate.affiliateCategory}
          onChange={handleInputChange}
          required
          className={validationErrors.affiliateCategory ? "border-red-500" : ""}
        />
        {validationErrors.affiliateCategory && (
          <p className="text-red-500 text-sm">
            {validationErrors.affiliateCategory}
          </p>
        )}
      </div>
      <div className="mb-4">
        <Label htmlFor="price">Starting Price</Label>
        <Input
          id="price"
          name="price"
          value={affiliate.price}
          onChange={handleInputChange}
          required
          className={validationErrors.price ? "border-red-500" : ""}
        />
        {validationErrors.price && (
          <p className="text-red-500 text-sm">{validationErrors.price}</p>
        )}
      </div>

      <div className="space-x-2">
        <Button type="submit">Add Affiliate</Button>
        <SheetClose asChild>
          <Button variant="outline">Close</Button>
        </SheetClose>
      </div>
    </form>
  );
}
