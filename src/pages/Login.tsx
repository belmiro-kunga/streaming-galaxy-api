import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [view, setView] = useState<'login' | 'signup' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async () => {
    // Mock authentication logic
    if (email === 'admin@example.com' && password === 'password') {
      localStorage.setItem('userSession', 'admin');
      toast({
        title: 'Login bem-sucedido',
        description: 'Você está logado como administrador.',
      });
      navigate('/admin-dashboard');
    } else if (email && password) {
      localStorage.setItem('userSession', 'user');
      toast({
        title: 'Login bem-sucedido',
        description: 'Você está logado como usuário.',
      });
      navigate('/');
    } else {
      toast({
        title: 'Credenciais inválidas',
        description: 'Por favor, verifique seu e-mail e senha.',
        variant: 'destructive',
      });
    }
  };

  const handleSignup = () => {
    // Mock signup logic
    toast({
      title: 'Conta criada',
      description: 'Sua conta foi criada com sucesso. Faça login para continuar.',
    });
    setView('login');
  };

  const handleResetPassword = () => {
    // Mock reset password logic
    toast({
      title: 'Redefinir senha',
      description: 'Um link para redefinir sua senha foi enviado para seu e-mail.',
    });
    setView('login');
  };

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
                  className="text-violet-300 hover:text-white font-medium hover:underline transition-colors"
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
                  className="text-violet-300 hover:text-white font-medium hover:underline transition-colors"
                >
                  Fazer login
                </button>
              </p>
            ) : (
              <p>
                <button
                  type="button"
                  onClick={() => setView('login')}
                  className="text-violet-300 hover:text-white font-medium hover:underline transition-colors"
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
          >
            {view === 'login' ? 'Entrar' : view === 'signup' ? 'Criar conta' : 'Redefinir'}
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
