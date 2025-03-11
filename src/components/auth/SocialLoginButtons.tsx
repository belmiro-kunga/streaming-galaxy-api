import React from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface SocialLoginButtonsProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true">
    <path
      fill="currentColor"
      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
    />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true">
    <path
      fill="currentColor"
      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
    />
  </svg>
);

const LoadingSpinner = () => (
  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({ 
  isLoading, 
  setIsLoading 
}) => {
  const { toast } = useToast();
  const [showQRCode, setShowQRCode] = React.useState(false);
  const [loadingProvider, setLoadingProvider] = React.useState<'google' | 'facebook' | null>(null);

  React.useEffect(() => {
    const checkScreenSize = () => {
      const widthInInches = window.screen.width / 96;
      setShowQRCode(widthInInches >= 25);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    try {
      setLoadingProvider(provider);
      setIsLoading(true);

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });
      
      if (error) throw error;

      toast({
        title: 'Redirecionando...',
        description: `Você será redirecionado para o login com ${provider === 'google' ? 'Google' : 'Facebook'}.`,
      });
    } catch (error: any) {
      console.error(`${provider} login error:`, error);
      toast({
        title: `Erro no login com ${provider === 'google' ? 'Google' : 'Facebook'}`,
        description: error?.message || `Não foi possível fazer login com ${provider === 'google' ? 'Google' : 'Facebook'}.`,
        variant: 'destructive',
      });
    } finally {
      setLoadingProvider(null);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex justify-center gap-4">
        <button
          onClick={() => handleSocialLogin('google')}
          disabled={isLoading}
          className="relative p-3 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-[#00B2FF] focus:ring-opacity-50 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loadingProvider === 'google' ? (
            <LoadingSpinner />
          ) : (
            <GoogleIcon />
          )}
        </button>
        
        <button
          onClick={() => handleSocialLogin('facebook')}
          disabled={isLoading}
          className="relative p-3 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-[#00B2FF] focus:ring-opacity-50 text-[#1877F2] hover:text-[#0966de] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loadingProvider === 'facebook' ? (
            <LoadingSpinner />
          ) : (
            <FacebookIcon />
          )}
        </button>
      </div>

      {showQRCode && (
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-gray-500">Ou faça login via QR Code</span>
          <div className="p-2 bg-white rounded-lg shadow-md">
            <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="w-24 h-24 bg-gray-300 rounded flex items-center justify-center">
                <span className="text-xs text-gray-500">Em breve</span>
              </div>
            </div>
          </div>
          <span className="text-xs text-gray-400 mt-1">Escaneie com seu celular</span>
        </div>
      )}
    </div>
  );
};
