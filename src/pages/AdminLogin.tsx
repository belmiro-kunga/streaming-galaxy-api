
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Lock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { mockSignIn } from '@/lib/supabase/auth';
import { useUser } from '@/contexts/UserContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { refreshUserData } = useUser();

  // Credenciais de teste já estão definidas em lib/supabase.ts
  // TEST_ADMIN_EMAIL = 'admin@cineplay.com';
  // TEST_ADMIN_PASSWORD = 'admin123';
  // TEST_EDITOR_EMAIL = 'editor@cineplay.com';
  // TEST_EDITOR_PASSWORD = 'editor123';
  // TEST_SUPER_ADMIN_EMAIL = 'super@cineplay.com';
  // TEST_SUPER_ADMIN_PASSWORD = 'super123';

  useEffect(() => {
    // Check if user is already logged in as admin
    const checkAdminStatus = async () => {
      const storedProfile = localStorage.getItem('userProfile');
      if (storedProfile) {
        try {
          const profile = JSON.parse(storedProfile);
          const role = profile?.role;
          
          if (['admin', 'editor', 'super_admin'].includes(role)) {
            navigate('/admin-dashboard');
          }
        } catch (e) {
          console.error('Error parsing stored profile:', e);
        }
      }
    };
    
    checkAdminStatus();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Attempting admin login with:', { email, password });
      // Sign in usando nossa função helper que funciona com ou sem Supabase
      const { data, error } = await mockSignIn(email, password);

      if (error) {
        console.error('Login error:', error);
        throw error;
      }

      // Check if user has admin role
      const user = data.user;
      const userRole = user?.user_metadata?.role || 'user';
      console.log('User data:', user);
      console.log('User role:', userRole);

      if (['admin', 'editor', 'super_admin'].includes(userRole)) {
        // Refresh user context data
        await refreshUserData();
        
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
        description: error.message || "Email ou senha incorretos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-gray-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-gray-800 bg-black/70 backdrop-blur-sm shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-2">
              <Shield className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-white">
              Área Administrativa
            </CardTitle>
            <CardDescription className="text-gray-400">
              Acesso restrito ao painel administrativo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-200">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 flex h-12 w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="admin@cineplay.com"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-200">
                    Senha
                  </Label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 flex h-12 w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full h-12 text-base"
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
                    Entrar
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 text-center text-sm text-gray-400">
            <p className="w-full">
              Área restrita para funcionários autorizados
            </p>
            <p className="text-xs text-gray-500">
              Acesso disponível para: Editor, Administrador e Super Administrador
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
