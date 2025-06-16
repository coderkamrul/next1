"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ImageUpload from "./ImageUpload";
import { Textarea } from "./ui/textarea";
import { SheetClose } from "./ui/sheet";
import axios from "axios";
import { TrashIcon } from "lucide-react";
import { Switch } from "./ui/switch";

export default function EditAffiliateForm({ affiliate, onClose }) {
  const [newAffiliate, setNewAffiliate] = useState({
    id: affiliate._id,
    isActive: affiliate.isActive,
    affiliateName: affiliate.affiliateName,
    affiliateDescription: affiliate.affiliateDescription,
    affiliateLink: affiliate.affiliateLink,
    affiliateImage: affiliate.affiliateImage,
    profileImage: affiliate.profileImage,
    affiliateCategory: affiliate.affiliateCategory,
    price: affiliate.price,
  });
  const [errors, setErrors] = useState({});

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) return;

    try {
      const response = await axios.put(
        `/api/affiliates/${affiliate.id}`,
        newAffiliate
      );
      console.log(response);
    } catch (error) {
      console.error(error);
    }

    onClose();
  };

  const handleInputChange = (e) => {
    const target = e.target;
    const value = target.value;
    const name = target.name;

    setNewAffiliate((prevState) => ({ ...prevState, [name]: value }));
    setErrors((prevState) => ({
      ...prevState,
      [name]: "",
    }));
  };

  const handleImageUpload = (imageUrl) => {
    setNewAffiliate((prevState) => ({
      ...prevState,
      affiliateImage: imageUrl,
    }));
    setErrors((prevState) => ({
      ...prevState,
      affiliateImage: "",
    }));
  };
  const handleProfileUpload = (imageUrl) => {
    setNewAffiliate((prevState) => ({
      ...prevState,
      profileImage: imageUrl,
    }));
    setErrors((prevState) => ({
      ...prevState,
      profileImage: "",
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!newAffiliate.affiliateName) {
      errors.affiliateName = "Please enter an affiliate name";
    }

    if (!newAffiliate.affiliateDescription) {
      errors.affiliateDescription = "Please enter a description";
    }

    if (!newAffiliate.affiliateLink) {
      errors.affiliateLink = "Please enter an affiliate link";
    }

    if (!newAffiliate.affiliateImage) {
      errors.affiliateImage = "Please add an image";
    }

    if (!newAffiliate.affiliateCategory) {
      errors.affiliateCategory = "Please enter a category";
    }
    if (!newAffiliate.price) {
      errors.price = "Please enter a price";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="flex gap-4 mt-4 mb-4">
        <div className={` ${!newAffiliate.profileImage ? "w-1/2" : "w-36"}`}>
          <Label>Profile Image</Label>
          {!newAffiliate.profileImage && (
            <ImageUpload onImageUpload={handleProfileUpload} />
          )}
          {newAffiliate.profileImage && (
            <div className="mt-2 flex items-center space-x-2 border border-dashed border-gray-300 rounded-md p-2 relative w-fit">
              <img
                src={newAffiliate.profileImage}
                alt="Affiliate Image"
                className="h-24 w-fit object-cover"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setNewAffiliate((prevState) => ({
                    ...prevState,
                    profileImage: "",
                  }))
                }
                className="text-gray-500 absolute top-0 right-0 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <TrashIcon className="h-5 w-5" />
              </Button>
            </div>
          )}
          {errors.affiliateImage && (
            <p className="text-red-600">{errors.affiliateImage}</p>
          )}
        </div>
        <div className="w-full">
          <Label htmlFor="affiliateName">Profile Name</Label>
          <Input
            id="affiliateName"
            name="affiliateName"
            value={newAffiliate.affiliateName}
            onChange={handleInputChange}
            required
          />
          {errors.affiliateName && (
            <p className="text-red-600">{errors.affiliateName}</p>
          )}
          <div className="flex items-center mt-4">
            <Switch
              id="isActive"
              name="isActive"
              checked={newAffiliate.isActive}
              onCheckedChange={(checked) =>
                setNewAffiliate((prevState) => ({
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
          value={newAffiliate.affiliateDescription}
          onChange={handleInputChange}
          required
        />
        {errors.affiliateDescription && (
          <p className="text-red-600">{errors.affiliateDescription}</p>
        )}
      </div>

      <div className="mb-4">
        <Label htmlFor="affiliateLink">Affiliate Link</Label>
        <Input
          id="affiliateLink"
          name="affiliateLink"
          value={newAffiliate.affiliateLink}
          onChange={handleInputChange}
          required
        />
        {errors.affiliateLink && (
          <p className="text-red-600">{errors.affiliateLink}</p>
        )}
      </div>

      <div className="mb-4">
        <Label>Affiliate Image</Label>
        <ImageUpload onImageUpload={handleImageUpload} />
        {newAffiliate.affiliateImage && (
          <div className="mt-2 flex items-center space-x-2 border border-dashed border-gray-300 rounded-md p-2 relative w-fit">
            <img
              src={newAffiliate.affiliateImage}
              alt="Affiliate Image"
              className="h-24 w-fit object-cover"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setNewAffiliate((prevState) => ({
                  ...prevState,
                  affiliateImage: "",
                }))
              }
              className="text-gray-500 absolute top-0 right-0 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <TrashIcon className="h-5 w-5" />
            </Button>
          </div>
        )}
        {errors.affiliateImage && (
          <p className="text-red-600">{errors.affiliateImage}</p>
        )}
      </div>

      <div className="mb-4">
        <Label htmlFor="affiliateCategory">Category</Label>
        <Input
          id="affiliateCategory"
          name="affiliateCategory"
          value={newAffiliate.affiliateCategory}
          onChange={handleInputChange}
          required
        />
        {errors.affiliateCategory && (
          <p className="text-red-600">{errors.affiliateCategory}</p>
        )}
      </div>
      <div className="mb-4">
        <Label htmlFor="price">Starting Price</Label>
        <Input
          id="price"
          name="price"
          value={newAffiliate.price}
          onChange={handleInputChange}
          required
        />
        {errors.price && <p className="text-red-600">{errors.price}</p>}
      </div>

      <div className="space-x-2">
        <Button type="submit">Update Affiliate</Button>
        <SheetClose asChild>
          <Button variant="outline">Close</Button>
        </SheetClose>
      </div>
    </form>
  );
}


