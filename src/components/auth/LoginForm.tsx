import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { mockSignIn, signOut } from '@/lib/supabase/auth';
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
  const { refreshUserData } = useUser();
  
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
      console.log('Tentando login com:', { email, password });
      const { data, error } = await mockSignIn(email, password);
      
      if (error) {
        console.error('Erro no login:', error);
        throw error;
      }
      
      if (data.user) {
        console.log('Login bem-sucedido, dados do usuário:', data.user);
        const role = data.user.user_metadata?.role || 'user';
        console.log('Role do usuário:', role);
        
        // Atualizar dados do usuário no contexto
        await refreshUserData();
        
        toast({
          title: 'Login bem-sucedido',
          description: `Você está logado como ${role}.`,
        });
        
        // Redirecionar baseado na role
        if (role === 'admin' || role === 'super_admin' || role === 'editor') {
          navigate('/admin-dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        console.log('Nenhum dado de usuário retornado:', data);
        throw new Error('Falha na autenticação');
      }
    } catch (error: any) {
      console.error('Erro no processo de login:', error);
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
        <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-200">
          Username
        </Label>
        <Input
          type="email"
          id="email"
          placeholder="@mail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00B2FF] focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-200">
          Password
        </Label>
        <Input
          type="password"
          id="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00B2FF] focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleLogin();
            }
          }}
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            className="w-4 h-4 border-2 border-gray-300 rounded text-[#00B2FF] focus:ring-[#00B2FF]"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
        </label>

        <button
          type="button"
          onClick={() => setView('reset')}
          className="text-sm text-[#00B2FF] hover:text-[#0066FF] hover:underline transition-colors"
        >
          Esqueceu a Senha?
        </button>
      </div>

      <Button
        onClick={handleLogin}
        className="w-full py-3 bg-[#00B2FF] hover:bg-[#0066FF] text-white font-medium rounded-lg transition-colors focus:ring-2 focus:ring-[#00B2FF] focus:ring-opacity-50"
        disabled={isLoading}
      >
        {isLoading ? 'Processando...' : 'Entrar'}
      </Button>
    </div>
  );
};
