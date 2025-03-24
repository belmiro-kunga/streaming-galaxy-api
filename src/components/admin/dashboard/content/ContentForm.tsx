
import React from 'react';
import { EnhancedContentForm } from './EnhancedContentForm';
import { ContentItem, Content } from '@/types/api';
import { useToast } from '@/hooks/use-toast';
import { contentAPI } from '@/services/content/contentAPI';

interface ContentFormProps {
  contentType: 'Filme' | 'Série' | 'Documentário';
  initialData?: Partial<ContentItem> | Partial<Content>;
  onCancel: () => void;
  onSubmit: (data: ContentItem) => void;
}

const ContentForm = ({ 
  contentType, 
  initialData, 
  onCancel, 
  onSubmit 
}: ContentFormProps) => {
  const { toast } = useToast();

  // Convert the initialData to ensure duracao is treated as a string for ContentItem
  const processedInitialData: Partial<ContentItem> = initialData ? {
    ...initialData,
    // Convert the duration to string if it's a number (from Content type)
    duracao: initialData.duracao !== undefined ? 
      (typeof initialData.duracao === 'number' ? 
        `${initialData.duracao} min` : initialData.duracao) : undefined
  } : {};

  const handleSubmit = async (data: Partial<ContentItem>) => {
    try {
      // Save content
      const savedContent = await contentAPI.saveContent({
        ...data,
        tipo: contentType.toLowerCase()
      });
      
      // Call parent handler
      onSubmit(savedContent);
      
      return savedContent;
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar o conteúdo. Tente novamente.",
        variant: "destructive"
      });
      throw error;
    }
  };

  return (
    <EnhancedContentForm
      contentType={contentType}
      initialData={processedInitialData}
      onSubmit={handleSubmit}
      onCancel={onCancel}
    />
  );
};

export default ContentForm;
