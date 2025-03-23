
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Upload, FileCheck, AlertCircle, Check, FileWarning } from 'lucide-react';
import { useCSVImport } from '@/hooks/use-csv-import';

const ImportCSV = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  
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

  return (
    <Card className="w-full shadow-sm border">
      <CardContent className="p-6">
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive ? 'border-primary bg-primary/5' : 'border-border'
          }`}
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
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <div className="rounded-full bg-primary/10 p-4">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-lg font-medium">
                  Arraste e solte um arquivo CSV aqui
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  ou clique para selecionar um arquivo
                </p>
              </div>
              <Button onClick={handleButtonClick} variant="secondary" size="lg" className="mt-4">
                Selecionar Arquivo
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-4">
                <FileCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-lg font-medium">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <Button onClick={handleButtonClick} variant="outline">
                  Alterar Arquivo
                </Button>
                <Button 
                  onClick={handleImport} 
                  disabled={isImporting}
                  className="sm:ml-2"
                >
                  {isImporting ? 'Importando...' : 'Importar Dados'}
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {isImporting && (
          <div className="mt-6 space-y-3">
            <p className="text-center font-medium">Processando arquivo...</p>
            <Progress value={importStats?.progress || 50} className="h-2" />
            <p className="text-center text-sm text-muted-foreground">
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
            </AlertDescription>
          </Alert>
        )}
        
        {importStats && importStats.success && (
          <Alert className="mt-6" variant="default">
            <Check className="h-4 w-4" />
            <AlertTitle className="text-green-600 dark:text-green-400">Importação concluída</AlertTitle>
            <AlertDescription>
              {importStats.message}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default ImportCSV;
