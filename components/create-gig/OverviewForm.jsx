import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function OverviewForm({ onNext, data }) {
  const [formData, setFormData] = useState({
    title: data.title || "",
    category: data.category || "",
    subcategory: data.subcategory || "",
    serviceType: data.serviceType || "",
    tags: data.tags || [],
  });

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      Object.values(formData).every(
        (value) =>
          value &&
          (typeof value === "string" ? value.trim() !== "" : value.length > 0)
      )
    ) {
      onNext(formData);
    } else {
      alert("Please fill in all fields before proceeding.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="title">Gig Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="I will do something I'm really good at"
          required
        />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Select
          onValueChange={(value) => handleChange("category", value)}
          value={formData.category}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="web-development">Web Development</SelectItem>
            <SelectItem value="portfolio-websites">
              Portfolio Websites
            </SelectItem>
            <SelectItem value="business-websites">Business Websites</SelectItem>
            <SelectItem value="landing-pages">Landing Pages</SelectItem>
            <SelectItem value="ecommerce-websites">
              E-commerce Websites
            </SelectItem>
            <SelectItem value="blogging-websites">
              Blogging & Content Websites
            </SelectItem>
            <SelectItem value="service-websites">
              Service-Based Websites
            </SelectItem>
            <SelectItem value="educational-websites">
              Educational Websites
            </SelectItem>
            <SelectItem value="nonprofit-websites">
              Non-Profit & Community Websites
            </SelectItem>
            <SelectItem value="event-booking-websites">
              Event & Booking Websites
            </SelectItem>
            <SelectItem value="classifieds-websites">
              Classifieds & Directory Websites
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="subcategory">Subcategory</Label>
        <Select
          onValueChange={(value) => handleChange("subcategory", value)}
          value={formData.subcategory}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a subcategory" />
          </SelectTrigger>
          <SelectContent>
            {formData.category === "web-development" && (
              <>
                <SelectItem value="portfolio-websites">
                  Portfolio Websites
                </SelectItem>
                <SelectItem value="business-websites">
                  Business Websites
                </SelectItem>
                <SelectItem value="landing-pages">Landing Pages</SelectItem>
                <SelectItem value="ecommerce-websites">
                  E-commerce Websites
                </SelectItem>
                <SelectItem value="blogging-websites">
                  Blogging & Content Websites
                </SelectItem>
                <SelectItem value="service-websites">
                  Service-Based Websites
                </SelectItem>
                <SelectItem value="educational-websites">
                  Educational Websites
                </SelectItem>
                <SelectItem value="nonprofit-websites">
                  Non-Profit & Community Websites
                </SelectItem>
                <SelectItem value="event-booking-websites">
                  Event & Booking Websites
                </SelectItem>
                <SelectItem value="classifieds-websites">
                  Classifieds & Directory Websites
                </SelectItem>
              </>
            )}

            {formData.category === "portfolio-websites" && (
              <>
                <SelectItem value="personal-portfolio">
                  Personal Portfolio
                </SelectItem>
                <SelectItem value="resume-cv">Resume / CV Website</SelectItem>
                <SelectItem value="photography-portfolio">
                  Photography Portfolio
                </SelectItem>
              </>
            )}

            {formData.category === "business-websites" && (
              <>
                <SelectItem value="small-business">
                  Small Business Website
                </SelectItem>
                <SelectItem value="corporate-website">
                  Corporate Website
                </SelectItem>
                <SelectItem value="real-estate">Real Estate Website</SelectItem>
              </>
            )}

            {formData.category === "landing-pages" && (
              <>
                <SelectItem value="product-launch">
                  Product Launch Page
                </SelectItem>
                <SelectItem value="lead-generation">
                  Lead Generation Page
                </SelectItem>
                <SelectItem value="sales-funnel">Sales Funnel Page</SelectItem>
              </>
            )}

            {formData.category === "ecommerce-websites" && (
              <>
                <SelectItem value="shopify-store">Shopify Store</SelectItem>
                <SelectItem value="woocommerce-store">
                  WooCommerce Store
                </SelectItem>
                <SelectItem value="dropshipping-store">
                  Dropshipping Store
                </SelectItem>
              </>
            )}

            {formData.category === "blogging-websites" && (
              <>
                <SelectItem value="personal-blog">Personal Blog</SelectItem>
                <SelectItem value="affiliate-blog">
                  Affiliate Marketing Blog
                </SelectItem>
                <SelectItem value="news-magazine">
                  News & Magazine Website
                </SelectItem>
              </>
            )}

            {formData.category === "service-websites" && (
              <>
                <SelectItem value="appointment-booking">
                  Appointment Booking Website
                </SelectItem>
                <SelectItem value="home-services">
                  Home Services Website
                </SelectItem>
                <SelectItem value="fitness-gym">
                  Fitness & Gym Website
                </SelectItem>
              </>
            )}

            {formData.category === "educational-websites" && (
              <>
                <SelectItem value="online-courses">
                  Online Course Platform (LMS)
                </SelectItem>
                <SelectItem value="tutor-booking">
                  Tutor & Coaching Website
                </SelectItem>
                <SelectItem value="school-university">
                  School & University Website
                </SelectItem>
              </>
            )}

            {formData.category === "nonprofit-websites" && (
              <>
                <SelectItem value="charity-donation">
                  Charity & Donation Website
                </SelectItem>
                <SelectItem value="church-religious">
                  Church & Religious Website
                </SelectItem>
                <SelectItem value="community-forum">
                  Community Forum & Membership Website
                </SelectItem>
              </>
            )}

            {formData.category === "event-booking-websites" && (
              <>
                <SelectItem value="event-management">
                  Event Management Website
                </SelectItem>
                <SelectItem value="wedding-planning">
                  Wedding & Party Planning Website
                </SelectItem>
                <SelectItem value="hotel-booking">
                  Hotel & Travel Booking Website
                </SelectItem>
              </>
            )}

            {formData.category === "classifieds-websites" && (
              <>
                <SelectItem value="business-directory">
                  Local Business Directory
                </SelectItem>
                <SelectItem value="real-estate-listing">
                  Real Estate Listing Website
                </SelectItem>
                <SelectItem value="automobile-marketplace">
                  Automobile Marketplace
                </SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="serviceType">Service Type</Label>
        <Input
          id="serviceType"
          value={formData.serviceType}
          onChange={(e) => handleChange("serviceType", e.target.value)}
          placeholder="e.g., WordPress Development"
          required
        />
      </div>
      <div>
        <Label htmlFor="tags">Search Tags (comma separated)</Label>
        <Input
          id="tags"
          value={formData.tags.join(", ")}
          onChange={(e) =>
            handleChange(
              "tags",
              e.target.value.split(",").map((tag) => tag.trim())
            )
          }
          placeholder="wordpress, web design, responsive"
          required
        />
      </div>
      <Button type="submit">Save & Continue</Button>
    </form>
  );
}
