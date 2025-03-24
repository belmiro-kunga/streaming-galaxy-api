
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Upload, FileCheck, AlertCircle, Check, FileWarning, RefreshCw, XCircle } from 'lucide-react';
import { useCSVImport } from '@/hooks/use-csv-import';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const ImportCSV = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();
  
  const { 
    importCSV, 
    isImporting, 
    importStats, 
    importErrors, 
    resetImport 
  } = useCSVImport();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      resetImport();
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      resetImport();
    }
  };

  const handleImport = async () => {
    if (selectedFile) {
      await importCSV(selectedFile);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    setSelectedFile(null);
    resetImport();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="border dark:border-gray-700 shadow-sm overflow-hidden">
      <CardContent className="p-6">
        <div 
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
            dragActive 
              ? "border-primary bg-primary/5" 
              : "border-gray-200 dark:border-gray-700",
            (isImporting || importStats?.success) && "opacity-50 pointer-events-none"
          )}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
          
          {!selectedFile ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="rounded-full bg-primary/10 p-5 mb-4">
                <Upload className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">
                Arraste e solte um arquivo CSV aqui
              </h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-md">
                ou clique para selecionar um arquivo do seu computador. O arquivo deve estar no formato CSV seguindo nosso template.
              </p>
              <Button onClick={handleButtonClick} variant="default" size="lg" className="gap-2">
                <Upload className="h-4 w-4" />
                Selecionar Arquivo
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-5 mb-4">
                <FileCheck className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-medium mb-1">
                {selectedFile.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                <Button onClick={handleButtonClick} variant="outline" className="gap-2 flex-1">
                  <Upload className="h-4 w-4" />
                  Trocar
                </Button>
                <Button 
                  onClick={handleImport} 
                  disabled={isImporting}
                  className="gap-2 flex-1"
                >
                  {isImporting ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <FileCheck className="h-4 w-4" />
                      Importar
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {isImporting && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Processando arquivo...</p>
              <p className="text-sm font-medium">{importStats?.progress || 0}%</p>
            </div>
            <Progress value={importStats?.progress || 0} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Isso pode levar alguns segundos dependendo do tamanho do arquivo
            </p>
          </div>
        )}
        
        {importErrors.length > 0 && (
          <Alert className="mt-6" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="flex items-center gap-2">
              <FileWarning className="h-4 w-4" />
              Erros na importação
            </AlertTitle>
            <AlertDescription>
              <div className="mt-2 max-h-48 overflow-y-auto">
                <ul className="list-disc pl-5 text-sm space-y-1">
                  {importErrors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleReset} 
                  className="gap-2"
                >
                  <XCircle className="h-4 w-4" />
                  Reiniciar importação
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        {importStats && importStats.success && (
          <Alert className="mt-6 border-green-500 dark:border-green-700 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300">
            <Check className="h-4 w-4" />
            <AlertTitle>Importação concluída com sucesso</AlertTitle>
            <AlertDescription>
              <p className="mb-4">{importStats.message}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleReset} 
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                Importar novo arquivo
              </Button>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default ImportCSV;
