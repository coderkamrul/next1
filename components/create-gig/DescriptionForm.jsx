import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star } from "lucide-react";
import Editor from "../Editor";

export default function DescriptionForm({ onNext, onBack, data }) {
  const [formData, setFormData] = useState({
    description: data.description || "",
    sellerInfo: data.seller?.description || "",
    reviews: data.reviews || [],
    reviewsCount: data.reviewsCount || 0,
  });
  const [description, setDescription] = useState({
    setupinstructions: data.description || "",
  })
  console.log(description);
  

  const [editorState, setEditorState] = useState('editor')
  const [textEditor, setTextEditor] = useState({ isReady: false })

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddReview = () => {
    setFormData((prev) => ({
      ...prev,
      reviews: [
        ...prev.reviews,
        {
          user: "",
          rating: 0,
          comment: "",
        },
      ],
    }));
  };

  const handleRemoveReview = (index) => {
    setFormData((prev) => ({
      ...prev,
      reviews: prev.reviews.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      formData.description !== "" &&
      formData.sellerInfo.trim() !== "" &&
      formData.reviewsCount > 0 &&
      formData.reviews.every(
        (review) =>
          review.user.trim() !== "" &&
          review.rating > 0 &&
          review.comment.trim() !== ""
      )
    ) {
      onNext({
        description: description.setupinstructions,
        seller: { ...data.seller, description: formData.sellerInfo },
        reviews: formData.reviews,
        reviewsCount: formData.reviewsCount,
      });
    } else {
      alert("Please fill in all fields before proceeding.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="description">Gig Description</Label>
        {/* <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Describe your gig in detail"
          rows={6}
          required
        /> */}
        <Editor
          setTextEditor={setTextEditor}
          setEditorState={setEditorState}
          formData={description}
          setFormData={setDescription}
        />
      </div>
      <div>
        <Label htmlFor="sellerInfo">About the Seller</Label>
        <Textarea
          id="sellerInfo"
          value={formData.sellerInfo}
          onChange={(e) => handleChange("sellerInfo", e.target.value)}
          placeholder="Tell buyers about yourself and your experience"
          rows={4}
          required
        />
      </div>
      <div>
        <Label htmlFor="reviewsCount">Reviews Count</Label>
        <Input
          id="reviewsCount"
          type="number"
          value={formData.reviewsCount}
          onChange={(e) => handleChange("reviewsCount", Number(e.target.value))}
          placeholder="Reviews Count"
          required
        />
      </div>
      {formData.reviews.map((review, index) => (
        <div key={index} className="space-y-4">
          <div>
            <Label htmlFor={`user-${index}`}>User</Label>
            <Input
              id={`user-${index}`}
              value={review.user}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  reviews: prev.reviews.map((r, i) =>
                    i === index ? { ...r, user: e.target.value } : r
                  ),
                }))
              }
              placeholder="User"
              required
            />
          </div>
          <div className="flex flex-col  space-y-2">
            <Label htmlFor={`rating-${index}`} className="flex-1">
              Set Rating
            </Label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Star
                  key={rating}
                  className={`cursor-pointer ${
                    review.rating >= rating
                      ? "text-yellow-500 stroke-current"
                      : "text-gray-400"
                  }`}
                  size={24}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      reviews: prev.reviews.map((r, i) =>
                        i === index ? { ...r, rating } : r
                      ),
                    }))
                  }
                />
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor={`comment-${index}`}>Comment</Label>
            <Textarea
              id={`comment-${index}`}
              value={review.comment}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  reviews: prev.reviews.map((r, i) =>
                    i === index ? { ...r, comment: e.target.value } : r
                  ),
                }))
              }
              placeholder="Comment"
              rows={3}
              required
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            onClick={() => handleRemoveReview(index)}
          >
            Remove
          </Button>
        </div>
      ))}
      <div className="flex justify-center">
        <Button type="button" variant="outline" onClick={handleAddReview}>
          Add Review
        </Button>
      </div>
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit">Save & Continue</Button>
      </div>
    </form>
  );
}
