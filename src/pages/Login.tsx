
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Lock, X, Github, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

type AuthView = 'login' | 'reset-password' | 'signup';

const Login = () => {
  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (view === 'login') {
        setTimeout(() => {
          navigate('/dashboard');
          toast({
            title: "Login realizado com sucesso!",
            description: "Bem-vindo de volta à CinePlay.",
          });
        }, 1000);
      } else if (view === 'reset-password') {
        setTimeout(() => {
          toast({
            title: "Email enviado!",
            description: "Verifique seu email para redefinir sua senha.",
          });
          setLoading(false);
          setView('login');
        }, 1000);
      } else if (view === 'signup') {
        // Simulate account creation
        setTimeout(() => {
          navigate('/dashboard');
          toast({
            title: "Conta criada com sucesso!",
            description: "Bem-vindo à CinePlay.",
          });
        }, 1000);
      }
    } catch (error) {
      toast({
        title: "Erro de autenticação",
        description: "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    setLoading(true);
    setTimeout(() => {
      navigate('/dashboard');
      toast({
        title: `Login com ${provider} realizado com sucesso!`,
        description: "Bem-vindo à CinePlay.",
      });
    }, 1000);
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
            <CardTitle className="text-2xl font-bold tracking-tight text-white">
              {view === 'login' && 'Entrar na CinePlay'}
              {view === 'reset-password' && 'Recuperar senha'}
              {view === 'signup' && 'Criar uma conta'}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {view === 'login' && 'Entre com sua conta para acessar o conteúdo'}
              {view === 'reset-password' && 'Enviaremos um link para redefinir sua senha'}
              {view === 'signup' && 'Preencha seus dados para criar uma nova conta'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {view === 'login' && (
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="h-12 w-full bg-gray-900 border-gray-700 hover:bg-gray-800"
                  onClick={() => handleSocialLogin('Facebook')}
                >
                  <Facebook className="mr-2 h-5 w-5 text-blue-500" />
                  Facebook
                </Button>
                <Button 
                  variant="outline" 
                  className="h-12 w-full bg-gray-900 border-gray-700 hover:bg-gray-800"
                  onClick={() => handleSocialLogin('Github')}
                >
                  <Github className="mr-2 h-5 w-5" />
                  Github
                </Button>
              </div>
            )}

            {view === 'login' && (
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-background px-2 text-muted-foreground">
                    ou continue com email
                  </span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {view === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-200">
                    Nome completo
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex h-12 w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Seu nome"
                    required={view === 'signup'}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-200">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 flex h-12 w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>
              
              {view !== 'reset-password' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-200">
                      Senha
                    </Label>
                    {view === 'login' && (
                      <button
                        type="button"
                        onClick={() => setView('reset-password')}
                        className="text-xs text-primary hover:underline"
                      >
                        Esqueceu a senha?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 flex h-12 w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="********"
                      required={view !== 'reset-password'}
                    />
                  </div>
                </div>
              )}

              {view === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-200">
                    Confirmar Senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 flex h-12 w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="********"
                      required={view === 'signup'}
                    />
                  </div>
                </div>
              )}
              
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
                    Processando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    {view === 'login' && 'Entrar'}
                    {view === 'reset-password' && 'Enviar link de recuperação'}
                    {view === 'signup' && 'Criar conta'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-wrap items-center justify-center">
            <div className="text-center text-sm text-gray-400">
              {view === 'login' ? (
                <p>
                  Não tem uma conta?{' '}
                  <button
                    type="button"
                    onClick={() => setView('signup')}
                    className="text-primary hover:underline"
                  >
                    Criar conta
                  </button>
                </p>
              ) : view === 'signup' ? (
                <p>
                  Já tem uma conta?{' '}
                  <button
                    type="button"
                    onClick={() => setView('login')}
                    className="text-primary hover:underline"
                  >
                    Fazer login
                  </button>
                </p>
              ) : (
                <p>
                  <button
                    type="button"
                    onClick={() => setView('login')}
                    className="text-primary hover:underline"
                  >
                    Voltar para o login
                  </button>
                </p>
              )}
            </div>
          </CardFooter>
        </Card>
        
        <div className="mt-4 text-center">
          <Link 
            to="/"
            className="text-sm text-gray-400 hover:text-white transition-colors inline-flex items-center"
          >
            <X className="mr-1 h-4 w-4" /> Cancelar e voltar
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
