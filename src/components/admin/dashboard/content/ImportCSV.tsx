
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle, Check, Upload, FileText } from 'lucide-react';
import { useCSVImport } from '@/hooks/use-csv-import';
import { toast } from 'sonner';

const ImportCSV = () => {
  const [file, setFile] = useState<File | null>(null);
  const { 
    importData, 
    previewData, 
    validationErrors, 
    importing, 
    progress, 
    importResult,
    resetImport
  } = useCSVImport();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      resetImport();
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Por favor, selecione um arquivo CSV para importar');
      return;
    }

    try {
      await importData(file);
      toast.success('Importação iniciada');
    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
      toast.error('Erro ao processar o arquivo CSV');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Importar Conteúdo via CSV</CardTitle>
          <CardDescription>
            Faça o upload de um arquivo CSV contendo filmes ou séries para importação em massa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-10 border-gray-300 dark:border-gray-700">
              <FileText size={48} className="text-gray-400 mb-4" />
              <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                Selecione um arquivo CSV para importar
              </p>
              <Input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="max-w-sm"
              />
              {file && (
                <p className="mt-2 text-sm">
                  Arquivo selecionado: <span className="font-medium">{file.name}</span>
                </p>
              )}
            </div>

            {validationErrors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erros no arquivo CSV</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {previewData.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Prévia dos dados (primeiras 5 linhas):</h3>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {Object.keys(previewData[0] || {}).map((key) => (
                          <TableHead key={key}>{key}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewData.slice(0, 5).map((row, index) => (
                        <TableRow key={index}>
                          {Object.values(row).map((value, idx) => (
                            <TableCell key={idx}>{value as string}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {importing && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Importando...</span>
                  <span className="text-sm">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} max={100} />
              </div>
            )}

            {importResult && (
              <Alert variant={importResult.errors.length > 0 ? "warning" : "success"} className="mt-4">
                <Check className="h-4 w-4" />
                <AlertTitle>Importação concluída</AlertTitle>
                <AlertDescription>
                  <div className="mt-2 space-y-2">
                    <div className="flex space-x-2">
                      <Badge variant="secondary">Total processado: {importResult.total}</Badge>
                      <Badge variant="success">Importados: {importResult.success}</Badge>
                      {importResult.errors.length > 0 && (
                        <Badge variant="destructive">Erros: {importResult.errors.length}</Badge>
                      )}
                    </div>
                    
                    {importResult.errors.length > 0 && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-sm font-medium">Ver detalhes dos erros</summary>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                          {importResult.errors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </details>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={resetImport} disabled={importing}>
            Limpar
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!file || importing}
            className="w-24"
          >
            {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
            {importing ? "Processando" : "Importar"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ImportCSV;
