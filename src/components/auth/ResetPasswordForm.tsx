
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface ResetPasswordFormProps {
  email: string;
  setEmail: (email: string) => void;
  setView: (view: 'login' | 'signup' | 'reset') => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  email,
  setEmail,
  setView,
  isLoading,
  setIsLoading
}) => {
  const { toast } = useToast();

  const handleResetPassword = async () => {
    if (!email) {
      toast({
        title: 'E-mail obrigatório',
        description: 'Por favor, informe seu e-mail para redefinir a senha.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast({
        title: 'Redefinir senha',
        description: 'Um link para redefinir sua senha foi enviado para seu e-mail.',
      });
      setView('login');
    } catch (error: any) {
      toast({
        title: 'Erro ao redefinir senha',
        description: error?.message || 'Não foi possível enviar o link de redefinição. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reset-email" className="text-foreground dark:text-gray-200">
          Email
        </Label>
        <Input
          type="email"
          id="reset-email"
          placeholder="seuemail@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-background dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={() => setView('login')}
          className="text-primary dark:text-violet-400 hover:text-primary/90 dark:hover:text-violet-300 font-medium hover:underline transition-colors"
        >
          Voltar para o login
        </button>

        <Button
          onClick={handleResetPassword}
          className="bg-primary dark:bg-violet-500 text-primary-foreground dark:text-white hover:bg-primary/90 dark:hover:bg-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-opacity-50 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? 'Processando...' : 'Redefinir'}
        </Button>
      </div>
    </div>
  );
};
