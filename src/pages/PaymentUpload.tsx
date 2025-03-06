
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, FileCheck, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/ui/Header';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { SubscriptionPlan } from '@/types/api';

const PaymentUpload = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  
  // Get the plan details from location state
  const planDetails = location.state?.plan as SubscriptionPlan;
  
  if (!planDetails) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Erro</CardTitle>
            <CardDescription>Nenhum plano selecionado</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Por favor, selecione um plano antes de continuar.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate('/subscription-plans')}>Voltar para Planos</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um comprovativo de pagamento",
        variant: "destructive"
      });
      return;
    }
    
    setUploading(true);
    
    // Mock API call to upload the payment proof
    setTimeout(() => {
      setUploading(false);
      setUploadComplete(true);
      
      toast({
        title: "Comprovativo enviado",
        description: "Seu comprovativo de pagamento foi enviado com sucesso. Aguarde a aprovação.",
      });
      
      // In a real app, you would make an API call to update the user's subscription status
    }, 2000);
  };

  // Obter o preço do plano
  const planPrice = planDetails.precos && planDetails.precos.length > 0 
    ? `${planDetails.precos[0].moeda_codigo} ${planDetails.precos[0].preco.toLocaleString()}`
    : "Preço não definido";
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button 
            variant="ghost" 
            className="mb-6"
            onClick={() => navigate('/subscription-plans')}
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Voltar para planos
          </Button>
          
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Envio de Comprovativo de Pagamento</CardTitle>
              <CardDescription>
                Envie o comprovativo de pagamento para ativar seu plano
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="text-lg font-medium mb-2">Detalhes do Plano</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Plano:</span>
                  <span>{planDetails.nome}</span>
                  
                  <span className="text-muted-foreground">Preço:</span>
                  <span>{planPrice} ({planDetails.ciclo_cobranca})</span>
                  
                  <span className="text-muted-foreground">Dispositivos:</span>
                  <span>{planDetails.telas_simultaneas}</span>
                  
                  <span className="text-muted-foreground">Qualidade:</span>
                  <span>{planDetails.qualidade_maxima}</span>

                  <span className="text-muted-foreground">Perfis:</span>
                  <span>{planDetails.limite_perfis}</span>

                  <span className="text-muted-foreground">Downloads:</span>
                  <span>{planDetails.limite_downloads}</span>
                </div>
              </div>
              
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Informações de Pagamento</AlertTitle>
                <AlertDescription>
                  Faça uma transferência bancária para a conta abaixo e envie o comprovativo:
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <span className="font-medium">Banco:</span>
                    <span>BAI</span>
                    
                    <span className="font-medium">Conta:</span>
                    <span>0123 4567 8910 1112</span>
                    
                    <span className="font-medium">Titular:</span>
                    <span>CINEPLAY, LDA</span>
                    
                    <span className="font-medium">IBAN:</span>
                    <span>AO06.0040.0000.5619.3253.1014.8</span>
                  </div>
                </AlertDescription>
              </Alert>
              
              {uploadComplete ? (
                <div className="bg-green-500/10 p-6 rounded-lg border border-green-500/20 text-center">
                  <FileCheck className="h-12 w-12 mx-auto text-green-500 mb-4" />
                  <h3 className="text-xl font-medium mb-2">Comprovativo Enviado</h3>
                  <p className="text-muted-foreground mb-4">
                    Seu comprovativo foi enviado com sucesso. Seu acesso será liberado assim que o pagamento for confirmado pela nossa equipe.
                  </p>
                  <Button onClick={() => navigate('/home')}>Voltar para o Início</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      id="payment-proof"
                      className="hidden"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                    />
                    <label 
                      htmlFor="payment-proof" 
                      className="flex flex-col items-center justify-center cursor-pointer"
                    >
                      <Upload className="h-10 w-10 text-gray-400 mb-3" />
                      <p className="text-lg font-medium mb-1">
                        {file ? file.name : "Clique para selecionar o comprovativo"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "Aceita imagens e PDF até 10MB"}
                      </p>
                    </label>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={!file || uploading}
                  >
                    {uploading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enviando...
                      </>
                    ) : "Enviar Comprovativo"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentUpload;
