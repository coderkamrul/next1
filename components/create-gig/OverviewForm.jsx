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
            <SelectItem value="mobile-app-development">
              Mobile App Development
            </SelectItem>
            <SelectItem value="desktop-app-development">
              Desktop App Development
            </SelectItem>
            <SelectItem value="game-development">Game Development</SelectItem>
            <SelectItem value="database-administration">
              Database Administration
            </SelectItem>
            <SelectItem value="devops">DevOps</SelectItem>
            <SelectItem value="qa-testing">QA Testing</SelectItem>
            <SelectItem value="network-administration">
              Network Administration
            </SelectItem>
            <SelectItem value="artificial-intelligence">
              Artificial Intelligence
            </SelectItem>
            <SelectItem value="machine-learning">Machine Learning</SelectItem>
            <SelectItem value="data-science">Data Science</SelectItem>
            <SelectItem value="cyber-security">Cyber Security</SelectItem>
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
                <SelectItem value="frontend-development">
                  Frontend Development
                </SelectItem>
                <SelectItem value="backend-development">
                  Backend Development
                </SelectItem>
                <SelectItem value="fullstack-development">
                  Fullstack Development
                </SelectItem>
                <SelectItem value="e-commerce-development">
                  E-commerce Development
                </SelectItem>
                <SelectItem value="cms-development">CMS Development</SelectItem>
                <SelectItem value="wordpress-development">
                  Wordpress Development
                </SelectItem>
                <SelectItem value="gohighlevel-development">
                  GoHighLevel Development
                </SelectItem>
              </>
            )}
            {formData.category === "mobile-app-development" && (
              <>
                <SelectItem value="ios-development">iOS Development</SelectItem>
                <SelectItem value="android-development">
                  Android Development
                </SelectItem>
              </>
            )}
            {formData.category === "desktop-app-development" && (
              <>
                <SelectItem value="windows-development">
                  Windows Development
                </SelectItem>
                <SelectItem value="mac-development">Mac Development</SelectItem>
                <SelectItem value="linux-development">
                  Linux Development
                </SelectItem>
              </>
            )}
            {formData.category === "game-development" && (
              <>
                <SelectItem value="unity-development">
                  Unity Development
                </SelectItem>
                <SelectItem value="unreal-engine-development">
                  Unreal Engine Development
                </SelectItem>
              </>
            )}
            {formData.category === "database-administration" && (
              <>
                <SelectItem value="mysql-administration">
                  MySQL Administration
                </SelectItem>
                <SelectItem value="mongodb-administration">
                  MongoDB Administration
                </SelectItem>
                <SelectItem value="postgresql-administration">
                  PostgreSQL Administration
                </SelectItem>
              </>
            )}
            {formData.category === "devops" && (
              <>
                <SelectItem value="aws-devops">AWS Devops</SelectItem>
                <SelectItem value="azure-devops">Azure Devops</SelectItem>
                <SelectItem value="google-cloud-devops">
                  Google Cloud Devops
                </SelectItem>
              </>
            )}
            {formData.category === "qa-testing" && (
              <>
                <SelectItem value="manual-testing">Manual Testing</SelectItem>
                <SelectItem value="automated-testing">
                  Automated Testing
                </SelectItem>
              </>
            )}
            {formData.category === "network-administration" && (
              <>
                <SelectItem value="network-security">
                  Network Security
                </SelectItem>
                <SelectItem value="network-architecture">
                  Network Architecture
                </SelectItem>
              </>
            )}
            {formData.category === "artificial-intelligence" && (
              <>
                <SelectItem value="machine-learning">
                  Machine Learning
                </SelectItem>
                <SelectItem value="natural-language-processing">
                  Natural Language Processing
                </SelectItem>
              </>
            )}
            {formData.category === "machine-learning" && (
              <>
                <SelectItem value="supervised-learning">
                  Supervised Learning
                </SelectItem>
                <SelectItem value="unsupervised-learning">
                  Unsupervised Learning
                </SelectItem>
                <SelectItem value="reinforcement-learning">
                  Reinforcement Learning
                </SelectItem>
              </>
            )}
            {formData.category === "data-science" && (
              <>
                <SelectItem value="data-analysis">Data Analysis</SelectItem>
                <SelectItem value="data-visualization">
                  Data Visualization
                </SelectItem>
                <SelectItem value="data-mining">Data Mining</SelectItem>
              </>
            )}
            {formData.category === "cyber-security" && (
              <>
                <SelectItem value="penetration-testing">
                  Penetration Testing
                </SelectItem>
                <SelectItem value="vulnerability-assessment">
                  Vulnerability Assessment
                </SelectItem>
                <SelectItem value="incident-response">
                  Incident Response
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
