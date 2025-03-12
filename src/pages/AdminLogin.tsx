
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { mockSignIn } from '@/lib/supabase';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Credenciais de teste já estão definidas em lib/supabase.ts
  // TEST_ADMIN_EMAIL = 'admin@cineplay.com';
  // TEST_EDITOR_EMAIL = 'editor@cineplay.com';
  // TEST_SUPER_ADMIN_EMAIL = 'super@cineplay.com';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Sign in usando nossa função helper com login sem senha
      const { data, error } = await mockSignIn(email, 'no-password-required');

      if (error) throw error;

      // Check if user has admin role
      const user = data.user;
      const userRole = user?.user_metadata?.role || 'user';

      if (['admin', 'editor', 'super_admin'].includes(userRole)) {
        navigate('/admin-dashboard');
        toast({
          title: "Login realizado com sucesso!",
          description: `Bem-vindo ao painel ${userRole === 'admin' ? 'administrativo' : userRole === 'editor' ? 'de edição' : 'de super administrador'}.`,
        });
      } else {
        throw new Error("Você não tem permissão para acessar esta área.");
      }
    } catch (error: any) {
      console.error("Admin authentication error:", error);
      toast({
        title: "Falha na autenticação",
        description: error.message || "Você não tem permissão para acessar esta área.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4">
      {/* Background com gradiente e padrão */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-95">
        {/* Padrão de fundo */}
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.05) 2%, transparent 0%), 
                           radial-gradient(circle at 75px 75px, rgba(255,255,255,0.05) 2%, transparent 0%)`,
          backgroundSize: '100px 100px'
        }} />
      </div>

      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Card de Login */}
      <Card className="w-full max-w-[380px] sm:max-w-[420px] md:max-w-[440px] shadow-2xl rounded-lg overflow-hidden bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm relative z-10">
        <CardHeader className="text-center pt-6 sm:pt-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Área Administrativa
          </CardTitle>
          <CardDescription className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">
            Acesso restrito ao painel administrativo
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-4 sm:p-6 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 w-full bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="admin@exemplo.com"
                    required
                  />
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full h-12 text-base bg-primary hover:bg-primary/90 text-white font-medium"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Autenticando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Entrar no Painel
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </span>
                )}
              </Button>
            </form>
          </motion.div>
        </CardContent>
        
        <CardFooter className="pb-6 sm:pb-8">
          <div className="w-full space-y-2 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Área restrita para funcionários autorizados
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Acesso disponível para: Editor, Administrador e Super Administrador
            </p>
          </div>
        </CardFooter>
      </Card>

      {/* Círculos decorativos */}
      <div className="fixed bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
      <div className="fixed top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
    </div>
  );
};

export default AdminLogin;
