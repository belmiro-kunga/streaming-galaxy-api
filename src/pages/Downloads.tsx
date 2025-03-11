import { useState, useEffect } from "react";
import { DownloadItem } from "../components/DownloadItem";
import { Download } from "lucide-react";
import { downloadDb } from "../services/downloadDb";
import { useToast } from "@/components/ui/use-toast";
import { MainLayout } from "@/components/layout/MainLayout";

interface DownloadedContent {
  id: string;
  title: string;
  thumbnail: string;
  size: string;
  downloadDate: Date;
  fileData: Blob;
}

export function Downloads() {
  const [downloads, setDownloads] = useState<DownloadedContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDownloads();
  }, []);

  const loadDownloads = async () => {
    try {
      const savedDownloads = await downloadDb.getAllDownloads();
      setDownloads(savedDownloads.map(download => ({
        ...download,
        downloadDate: new Date(download.downloadDate)
      })));
    } catch (error) {
      toast({
        title: "Erro ao carregar downloads",
        description: "Não foi possível carregar seus downloads. Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await downloadDb.deleteDownload(id);
      setDownloads(downloads.filter(download => download.id !== id));
      toast({
        title: "Download removido",
        description: "O conteúdo foi removido dos seus downloads."
      });
    } catch (error) {
      toast({
        title: "Erro ao remover download",
        description: "Não foi possível remover o download. Por favor, tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleWatch = async (id: string) => {
    try {
      const download = await downloadDb.getDownload(id);
      if (download?.fileData) {
        // Criar URL temporária para o arquivo
        const url = URL.createObjectURL(download.fileData);
        window.open(url, '_blank');
        // Limpar URL após abrir
        setTimeout(() => URL.revokeObjectURL(url), 100);
      }
    } catch (error) {
      toast({
        title: "Erro ao abrir conteúdo",
        description: "Não foi possível abrir o conteúdo. Por favor, tente novamente.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="py-8 text-center">
          <p>Carregando downloads...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="py-8">
        <div className="flex items-center gap-2 mb-8">
          <Download className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Downloads</h1>
        </div>

        {downloads.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">Nenhum download encontrado</h2>
            <p className="text-muted-foreground">
              Os conteúdos que você baixar aparecerão aqui para assistir offline.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {downloads.map((download) => (
              <DownloadItem
                key={download.id}
                title={download.title}
                thumbnail={download.thumbnail}
                size={download.size}
                downloadDate={download.downloadDate}
                onDelete={() => handleDelete(download.id)}
                onWatch={() => handleWatch(download.id)}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
} 