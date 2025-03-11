import { Play } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface FreeContentCardProps {
  title: string;
  thumbnail: string;
  category: string;
  duration: string;
  quality: string;
  onWatch: () => void;
}

export function FreeContentCard({
  title,
  thumbnail,
  category,
  duration,
  quality,
  onWatch
}: FreeContentCardProps) {
  return (
    <Card className="w-full h-full flex flex-col group">
      <CardHeader className="flex-none p-4">
        <div className="flex items-center justify-between">
          <Badge variant="secondary">{category}</Badge>
          <Badge variant="outline">{quality}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <div className="relative aspect-video">
          <img
            src={thumbnail}
            alt={title}
            className="object-cover w-full h-full rounded-none"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:text-white hover:bg-primary/20"
              onClick={onWatch}
            >
              <Play className="h-12 w-12" />
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-none p-4">
        <div className="space-y-1 flex-1">
          <CardTitle className="text-base line-clamp-1">{title}</CardTitle>
          <p className="text-xs text-muted-foreground">{duration}</p>
        </div>
      </CardFooter>
    </Card>
  );
} 