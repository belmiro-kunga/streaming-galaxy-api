
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { mockSignIn, signOut, TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD, 
         TEST_EDITOR_EMAIL, TEST_EDITOR_PASSWORD, 
         TEST_SUPER_ADMIN_EMAIL, TEST_SUPER_ADMIN_PASSWORD } from '@/lib/supabase/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  setView: (view: 'login' | 'signup' | 'reset') => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  setView,
  isLoading,
  setIsLoading
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { refreshUserData, user } = useUser();
  
  // Get the return path from location state
  const from = location.state?.from?.pathname || '/dashboard';

  // Check if user is already logged in
  useEffect(() => {
    if (user) {
      const role = user.user_metadata?.role || 'user';
      
      if (['admin', 'editor', 'super_admin'].includes(role)) {
        navigate('/admin-dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  // For development purposes, provide test credentials
  const handleTestCredentials = (type: 'admin' | 'editor' | 'super') => {
    if (type === 'admin') {
      setEmail(TEST_ADMIN_EMAIL);
      setPassword(TEST_ADMIN_PASSWORD);
    } else if (type === 'editor') {
      setEmail(TEST_EDITOR_EMAIL);
      setPassword(TEST_EDITOR_PASSWORD);
    } else if (type === 'super') {
      setEmail(TEST_SUPER_ADMIN_EMAIL);
      setPassword(TEST_SUPER_ADMIN_PASSWORD);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha todos os campos.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Attempting login with:', { email, password });
      
      // Use our test credentials if they match
      const isTestCredential = 
        (email === TEST_ADMIN_EMAIL && password === TEST_ADMIN_PASSWORD) ||
        (email === TEST_EDITOR_EMAIL && password === TEST_EDITOR_PASSWORD) ||
        (email === TEST_SUPER_ADMIN_EMAIL && password === TEST_SUPER_ADMIN_PASSWORD);
      
      if (isTestCredential) {
        console.log('Using test credentials');
      }
      
      const { data, error } = await mockSignIn(email, password);
      
      if (error) {
        console.error('Login error:', error);
        throw error;
      }
      
      if (data.user) {
        console.log('Login successful, user data:', data.user);
        const role = data.user.user_metadata?.role || 'user';
        console.log('User role:', role);
        
        // Refresh user data in context
        await refreshUserData();
        
        toast({
          title: 'Login bem-sucedido',
          description: `Você está logado como ${role}.`,
        });
        
        if (['admin', 'editor', 'super_admin'].includes(role)) {
          navigate('/admin-dashboard');
        } else {
          // Navigate to the original location or dashboard
          navigate(from);
        }
      } else {
        console.log('No user data returned:', data);
        throw new Error('Falha na autenticação');
      }
    } catch (error: any) {
      console.error('Login process error:', error);
      toast({
        title: 'Erro no login',
        description: error?.message || 'Verifique suas credenciais e tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground dark:text-gray-200">
          Email
        </Label>
        <Input
          type="email"
          id="email"
          placeholder="seuemail@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-background dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-foreground dark:text-gray-200">
          Senha
        </Label>
        <Input
          type="password"
          id="password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-background dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleLogin();
            }
          }}
        />
      </div>

      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={() => setView('reset')}
          className="text-sm text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-gray-300 hover:underline transition-colors"
        >
          Esqueceu sua senha?
        </button>

        <Button
          onClick={handleLogin}
          className="bg-primary dark:bg-violet-500 text-primary-foreground dark:text-white hover:bg-primary/90 dark:hover:bg-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-opacity-50 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? 'Processando...' : 'Entrar'}
        </Button>
      </div>
      
      {/* Development helpers - remove in production */}
      {process.env.NODE_ENV !== 'production' && (
        <div className="mt-6 border-t pt-4 text-xs text-gray-500">
          <div className="mb-2">Credenciais de teste:</div>
          <div className="space-x-2">
            <button 
              className="text-xs underline" 
              onClick={() => handleTestCredentials('admin')}
            >
              Admin
            </button>
            <button 
              className="text-xs underline" 
              onClick={() => handleTestCredentials('editor')}
            >
              Editor
            </button>
            <button 
              className="text-xs underline" 
              onClick={() => handleTestCredentials('super')}
            >
              Super Admin
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
