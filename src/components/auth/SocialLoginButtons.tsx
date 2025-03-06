
import React from 'react';
import { Button } from '@/components/ui/button';
import { GoogleIcon } from '@/components/icons/GoogleIcon';
import { FacebookIcon } from '@/components/SocialIcons';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface SocialLoginButtonsProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({ 
  isLoading, 
  setIsLoading 
}) => {
  const { toast } = useToast();

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error('Google login error:', error);
      toast({
        title: 'Erro no login com Google',
        description: error?.message || 'Não foi possível fazer login com o Google.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error('Facebook login error:', error);
      toast({
        title: 'Erro no login com Facebook',
        description: error?.message || 'Não foi possível fazer login com o Facebook.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Button 
          onClick={handleGoogleLogin} 
          variant="outline" 
          type="button" 
          className="flex items-center justify-center gap-2 bg-background dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          disabled={isLoading}
        >
          <GoogleIcon className="h-4 w-4" />
          <span>Continuar com Google</span>
        </Button>
        
        <Button 
          onClick={handleFacebookLogin} 
          variant="outline" 
          type="button" 
          className="flex items-center justify-center gap-2 bg-background dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          disabled={isLoading}
        >
          <FacebookIcon className="h-4 w-4" />
          <span>Continuar com Facebook</span>
        </Button>
      </div>
    </div>
  );
};
