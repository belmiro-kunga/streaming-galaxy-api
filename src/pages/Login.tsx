
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase, mockSignIn } from '@/lib/supabase';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Login = () => {
  const [view, setView] = useState<'login' | 'signup' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState('Angola');
  const [province, setProvince] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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
      const { data, error } = await mockSignIn(email, password);
      
      if (error) throw error;
      
      if (data.user) {
        const role = data.user.user_metadata?.role || 'user';
        
        toast({
          title: 'Login bem-sucedido',
          description: `Você está logado como ${role}.`,
        });
        
        if (role === 'admin' || role === 'super_admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/');
        }
      }
    } catch (error: any) {
      toast({
        title: 'Erro no login',
        description: error?.message || 'Verifique suas credenciais e tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
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
      // Registrar o usuário com Supabase
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
          }
        }
      });

      if (error) throw error;

      toast({
        title: 'Conta criada',
        description: 'Sua conta foi criada com sucesso. Você já pode fazer login.',
      });
      setView('login');
    } catch (error: any) {
      toast({
        title: 'Erro no cadastro',
        description: error?.message || 'Não foi possível criar sua conta. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  const provinces = [
    'Bengo', 'Benguela', 'Bié', 'Cabinda', 'Cuando Cubango', 
    'Cuanza Norte', 'Cuanza Sul', 'Cunene', 'Huambo', 'Huíla', 
    'Luanda', 'Lunda Norte', 'Lunda Sul', 'Malanje', 'Moxico', 
    'Namibe', 'Uíge', 'Zaire'
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md shadow-xl rounded-lg overflow-hidden">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-800">
            {view === 'login' ? 'Login' : view === 'signup' ? 'Criar conta' : 'Redefinir senha'}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {view === 'login'
              ? 'Entre com seu e-mail e senha'
              : view === 'signup'
              ? 'Crie uma nova conta'
              : 'Redefina sua senha'}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-4">
            {/* Email field - shown in all views */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-gray-300 focus:ring-violet-500 focus:border-violet-500"
              />
            </div>

            {/* Password field - shown in login and signup views */}
            {view !== 'reset' && (
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">
                  Senha
                </Label>
                <Input
                  type="password"
                  id="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-gray-300 focus:ring-violet-500 focus:border-violet-500"
                />
              </div>
            )}

            {/* Additional signup fields */}
            {view === 'signup' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700">
                    Confirmar Senha
                  </Label>
                  <Input
                    type="password"
                    id="confirmPassword"
                    placeholder="********"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border-gray-300 focus:ring-violet-500 focus:border-violet-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-gray-700">
                      Primeiro Nome
                    </Label>
                    <Input
                      type="text"
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="border-gray-300 focus:ring-violet-500 focus:border-violet-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-gray-700">
                      Último Nome
                    </Label>
                    <Input
                      type="text"
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="border-gray-300 focus:ring-violet-500 focus:border-violet-500"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-gray-700">
                    Número de Telefone
                  </Label>
                  <Input
                    type="tel"
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="border-gray-300 focus:ring-violet-500 focus:border-violet-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-gray-700">
                    País
                  </Label>
                  <Input
                    type="text"
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="border-gray-300 focus:ring-violet-500 focus:border-violet-500"
                    disabled
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="province" className="text-gray-700">
                    Província
                  </Label>
                  <Select
                    value={province}
                    onValueChange={setProvince}
                  >
                    <SelectTrigger className="bg-white border-gray-300 focus:ring-violet-500 focus:border-violet-500">
                      <SelectValue placeholder="Selecione uma província" />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces.map((prov) => (
                        <SelectItem key={prov} value={prov}>
                          {prov}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between pb-8">
          <div>
            {view === "login" ? (
              <p>
                Não tem uma conta?{' '}
                <button
                  type="button"
                  onClick={() => setView('signup')}
                  className="text-violet-500 hover:text-violet-700 font-medium hover:underline transition-colors"
                >
                  Criar conta
                </button>
              </p>
            ) : view === "signup" ? (
              <p>
                Já tem uma conta?{' '}
                <button
                  type="button"
                  onClick={() => setView('login')}
                  className="text-violet-500 hover:text-violet-700 font-medium hover:underline transition-colors"
                >
                  Fazer login
                </button>
              </p>
            ) : (
              <p>
                <button
                  type="button"
                  onClick={() => setView('login')}
                  className="text-violet-500 hover:text-violet-700 font-medium hover:underline transition-colors"
                >
                  Voltar para o login
                </button>
              </p>
            )}
          </div>
          
          <Button
            onClick={
              view === 'login'
                ? handleLogin
                : view === 'signup'
                ? handleSignup
                : handleResetPassword
            }
            className="bg-violet-500 text-white hover:bg-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-opacity-50 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? 'Processando...' : view === 'login' ? 'Entrar' : view === 'signup' ? 'Criar conta' : 'Redefinir'}
          </Button>
        </CardFooter>
        
        <div className="text-center pb-8">
          {view === 'login' && (
            <button
              type="button"
              onClick={() => setView('reset')}
              className="text-sm text-gray-500 hover:text-gray-700 hover:underline transition-colors"
            >
              Esqueceu sua senha?
            </button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Login;
