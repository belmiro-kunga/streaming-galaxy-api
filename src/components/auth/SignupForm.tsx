
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface SignupFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (confirmPassword: string) => void;
  firstName: string;
  setFirstName: (firstName: string) => void;
  lastName: string;
  setLastName: (lastName: string) => void;
  phoneNumber: string;
  setPhoneNumber: (phoneNumber: string) => void;
  country: string;
  province: string;
  setProvince: (province: string) => void;
  setView: (view: 'login' | 'signup' | 'reset') => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  phoneNumber,
  setPhoneNumber,
  country,
  province,
  setProvince,
  setView,
  isLoading,
  setIsLoading
}) => {
  const { toast } = useToast();
  
  const provinces = [
    'Bengo', 'Benguela', 'Bié', 'Cabinda', 'Cuando Cubango', 
    'Cuanza Norte', 'Cuanza Sul', 'Cunene', 'Huambo', 'Huíla', 
    'Luanda', 'Lunda Norte', 'Lunda Sul', 'Malanje', 'Moxico', 
    'Namibe', 'Uíge', 'Zaire'
  ];

  const validateEmail = (email: string) => {
    // Simple email validation
    return email.includes('@');
  };

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword || !firstName || !lastName || !phoneNumber || !country || !province) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha todos os campos.',
        variant: 'destructive',
      });
      return;
    }

    if (!validateEmail(email)) {
      toast({
        title: 'Email inválido',
        description: 'Por favor, insira um endereço de email válido.',
        variant: 'destructive',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Senhas não coincidem',
        description: 'A senha e a confirmação de senha devem ser iguais.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Attempting to register with email:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone: phoneNumber,
            country: country,
            province: province,
            role: 'user'
          },
          emailRedirectTo: `${window.location.origin}/login`
        }
      });

      if (error) {
        console.error('Signup error:', error);
        throw error;
      }

      console.log('Signup response:', data);
      
      toast({
        title: 'Conta criada',
        description: 'Sua conta foi criada com sucesso. Você já pode fazer login.',
      });
      setView('login');
    } catch (error: any) {
      console.error('Error details:', error);
      
      toast({
        title: 'Erro no cadastro',
        description: error?.message || 'Não foi possível criar sua conta. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-email" className="text-foreground dark:text-gray-200">
          Email
        </Label>
        <Input
          type="email"
          id="signup-email"
          placeholder="seuemail@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-background dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-password" className="text-foreground dark:text-gray-200">
          Senha
        </Label>
        <Input
          type="password"
          id="signup-password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-background dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-foreground dark:text-gray-200">
          Confirmar Senha
        </Label>
        <Input
          type="password"
          id="confirmPassword"
          placeholder="********"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="bg-background dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-foreground dark:text-gray-200">
            Primeiro Nome
          </Label>
          <Input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="bg-background dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-foreground dark:text-gray-200">
            Último Nome
          </Label>
          <Input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="bg-background dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phoneNumber" className="text-foreground dark:text-gray-200">
          Número de Telefone
        </Label>
        <Input
          type="tel"
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="bg-background dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="country" className="text-foreground dark:text-gray-200">
          País
        </Label>
        <Input
          type="text"
          id="country"
          value={country}
          disabled
          className="bg-background dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="province" className="text-foreground dark:text-gray-200">
          Província
        </Label>
        <Select
          value={province}
          onValueChange={setProvince}
        >
          <SelectTrigger className="bg-background dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <SelectValue placeholder="Selecione uma província" />
          </SelectTrigger>
          <SelectContent className="bg-popover dark:bg-gray-800 dark:border-gray-700">
            {provinces.map((prov) => (
              <SelectItem key={prov} value={prov} className="dark:text-gray-200 dark:data-[state=checked]:text-white">
                {prov}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-between items-center pt-4">
        <button
          type="button"
          onClick={() => setView('login')}
          className="text-primary dark:text-violet-400 hover:text-primary/90 dark:hover:text-violet-300 font-medium hover:underline transition-colors"
        >
          Já tem uma conta? Fazer login
        </button>

        <Button
          onClick={handleSignup}
          className="bg-primary dark:bg-violet-500 text-primary-foreground dark:text-white hover:bg-primary/90 dark:hover:bg-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-opacity-50 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? 'Processando...' : 'Criar conta'}
        </Button>
      </div>
    </div>
  );
};
