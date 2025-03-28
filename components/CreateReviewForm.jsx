"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import ImageUpload from "./ImageUpload";
import { Textarea } from "./ui/textarea";
import { Star } from "lucide-react";

const Rating = ({ rating, onRatingChange }) => {
  const handleChange = (e) => {
    const { value } = e.target;
    onRatingChange(value);
  };

  return (
    <div className="flex items-center space-x-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <label key={i}>
          <input
            type="radio"
            name="rating"
            value={i}
            checked={rating === i}
            onChange={handleChange}
            className="hidden"
          />
          <span className="sr-only">Rating {i}</span>
          <Star
            className={
              rating >= i
                ? "text-yellow-400 cursor-pointer"
                : "text-gray-400 hover:text-yellow-400 cursor-pointer"
            }
          />
        </label>
      ))}
    </div>
  );
};

export default function CreateReviewForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectImage: "",
    profilePicture: "",
    review: "",
    reply: "",
    rating: 0,
    projectLink: "",
  });
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageUpload = (imageUrl) => {
    setFormData((prevState) => ({
      ...prevState,

      profilePicture: imageUrl,
    }));
  };
  const handleprojectImageUpload = (imageUrl) => {
    setFormData((prevState) => ({
      ...prevState,

      projectImage: imageUrl,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
        }),
      });

      if (res.ok) {
        router.push("/dashboard/reviews");
        toast({
          title: "Review created",
          description: "Your review has been created successfully.",
        });
      } else {
        throw new Error("Failed to create review");
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to create review. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="clientName">Client Name</Label>
        <Input
          type="text"
          name="name"
          id="clientName"
          required
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          name="email"
          id="email"
          required
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          type="tel"
          name="phone"
          id="phone"
          required
          value={formData.phone}
          onChange={handleChange}
        />
      </div>

      <div>
        <Label htmlFor="review">Review</Label>
        <Textarea
          name="review"
          id="review"
          required
          value={formData.review}
          onChange={handleChange}
          rows="3"
        />
      </div>
      <div>
        <Label htmlFor="reply">Reply</Label>
        <Textarea
          name="reply"
          id="reply"
          required
          value={formData.reply}
          onChange={handleChange}
          rows="3"
        />
      </div>
      <div>
        <Label htmlFor="projectLink">Project Link</Label>
        <Input
          type="url"
          name="projectLink"
          id="projectLink"
          value={formData.projectLink}
          onChange={handleChange}
        />
      </div>
      <div>
        <span className="py-2">Rating</span>
        <Rating
          rating={formData.rating}
          onRatingChange={(rating) =>
            setFormData((prevState) => ({
              ...prevState,

              rating,
            }))
          }
        />
      </div>
      <div className="flex w-full gap-2 flex-wrap md:flex-nowrap">
        <div className="w-full">
          <div className="py-2">Profile Picture</div>
          <ImageUpload onImageUpload={handleImageUpload} />
          {formData.profilePicture && (
            <img
              src={formData.profilePicture}
              alt="Profile Picture"
              className="mt-2 max-w-xs rounded-md"
            />
          )}
        </div>
        <div className="w-full">
          <div className="py-2">Project Image</div>
          <ImageUpload onImageUpload={handleprojectImageUpload} />
          {formData.projectImage && (
            <img
              src={formData.projectImage}
              alt="Profile Picture"
              className="mt-2 max-w-xs rounded-md"
            />
          )}
        </div>
      </div>
      <Button type="submit">Create Review</Button>
    </form>
  );
}
