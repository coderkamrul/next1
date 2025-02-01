import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Star } from "lucide-react";
import Link from "next/link";

export default function TestimonialCard({
  imageUrl,
  clientReview,
  reply,
  clientName,
  avatarUrl,
  projectUrl,
  star,

}) {
  

  return (
    <Card className="w-full md:max-w-[320px] h-full overflow-hidden">
      <CardContent className="p-2 h-full flex justify-between flex-col">
        <div className="w-full h-[200px] border border-zinc-200 rounded-lg overflow-hidden relative">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt="Project Preview"
            className="w-full h-full object-cover"
          />
        </div>
        <div className=" pt-3 space-y-3 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Client Review Message */}

            <div className=" bg-primary px-4 py-3 max-w-[90%] rounded-2xl">
              <p className="text-sm text-primary-foreground line-clamp-3">{clientReview}</p>
            </div>
            {/* Reply Message */}
            <div className="flex justify-end">
              <div className="bg-muted px-4 py-3 rounded-2xl max-w-[80%] ml-12">
                <p className="text-sm  ">
                  {reply || "Thank you!"}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={avatarUrl} alt={clientName} />
                <AvatarFallback>
                  {clientName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
              <span className="font-medium">{clientName}</span>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < star ? "fill-yellow-400 text-yellow-400" : "fill-transparent text-gray-300"}
                  />
                ))}
              </div>
              
              </div>
            </div>
            {projectUrl && (
              
            <Link
              href={projectUrl}
              className="p-2 hover:bg-accent rounded-full transition-colors"
              title="View Project"
              target="_blank"
            >
              <ExternalLink className="h-5 w-5" />
            </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
