
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Upload, FileCheck, AlertCircle, Check } from 'lucide-react';
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
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle>Importar Conteúdo</CardTitle>
        <CardDescription>
          Faça upload de um arquivo CSV contendo filmes e séries para adicionar ao catálogo
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div 
          className={`border-2 border-dashed rounded-lg p-6 text-center ${
            dragActive ? 'border-primary bg-primary/10' : 'border-gray-300'
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
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="rounded-full bg-gray-100 p-3">
                <Upload className="h-6 w-6 text-gray-500" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  Arraste e solte um arquivo CSV aqui ou
                </p>
                <p className="text-xs text-gray-500">
                  CSV com os detalhes de filmes e séries
                </p>
              </div>
              <Button onClick={handleButtonClick} variant="outline" size="sm">
                Selecionar Arquivo
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="rounded-full bg-green-100 p-3">
                <FileCheck className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleButtonClick} variant="outline" size="sm">
                  Alterar Arquivo
                </Button>
                <Button 
                  onClick={handleImport} 
                  disabled={isImporting} 
                  size="sm"
                >
                  {isImporting ? 'Importando...' : 'Importar Dados'}
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {isImporting && (
          <div className="mt-4 space-y-2">
            <p className="text-sm text-center">Processando arquivo...</p>
            <Progress value={50} className="h-2" />
          </div>
        )}
        
        {importErrors.length > 0 && (
          <Alert className="mt-4" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erros na importação</AlertTitle>
            <AlertDescription>
              <ul className="mt-2 list-disc pl-5 text-sm">
                {importErrors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
        
        {importStats && importStats.success && (
          <Alert className="mt-4" variant="default">
            <Check className="h-4 w-4" />
            <AlertTitle>Importação concluída</AlertTitle>
            <AlertDescription>
              {importStats.message}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      
      <CardFooter className="text-sm text-gray-500 flex-col items-start">
        <p>Instruções:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Certifique-se de que o CSV possui as colunas corretas para filmes e séries</li>
          <li>O campo Diretório deve ser um dos seguintes: Netflix, Prime Video, Disney Plus, Max, Paramount Plus, Globoplay, Hulu, Crunchyroll, Cinema</li>
          <li>Após importação, o status dos itens será "pendente", e você poderá aprová-los ou rejeitá-los na tela de Filmes e Séries</li>
        </ul>
      </CardFooter>
    </Card>
  );
};

export default ImportCSV;
