import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";

interface DownloadItemProps {
  title: string;
  thumbnail: string;
  size: string;
  downloadDate: Date;
  onDelete: () => void;
  onWatch: () => void;
}

export function DownloadItem({ 
  title, 
  thumbnail, 
  size, 
  downloadDate, 
  onDelete, 
  onWatch 
}: DownloadItemProps) {
  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="flex-none">
        <CardTitle className="text-base sm:text-lg line-clamp-1">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="aspect-video relative overflow-hidden rounded-md">
          <img 
            src={thumbnail} 
            alt={title} 
            className="object-cover w-full h-full hover:scale-105 transition-transform"
          />
        </div>
        <div className="mt-4 space-y-1 text-xs sm:text-sm text-muted-foreground">
          <p>Tamanho: {size}</p>
          <p>Baixado em: {downloadDate.toLocaleDateString('pt-BR')}</p>
        </div>
      </CardContent>
      <CardFooter className="flex-none flex flex-col sm:flex-row gap-2 sm:justify-between">
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={onDelete}
          className="w-full sm:w-auto"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Excluir
        </Button>
        <Button 
          variant="default" 
          size="sm" 
          onClick={onWatch}
          className="w-full sm:w-auto"
        >
          Assistir Offline
        </Button>
      </CardFooter>
    </Card>
  );
} 