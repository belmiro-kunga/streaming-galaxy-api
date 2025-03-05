import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Mail, ArrowRight, Lock, User, X } from 'lucide-react';
import { GoogleIcon } from '@/components/icons/GoogleIcon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

type AuthView = 'login' | 'signup' | 'reset-password';

const Login = () => {
  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
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
            description: "Bem-vindo de volta à Streaming Galaxy.",
          });
        }, 1000);
      } else if (view === 'signup') {
        if (password !== confirmPassword) {
          toast({
            title: "Erro na senha",
            description: "As senhas não coincidem.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        setTimeout(() => {
          setView('login');
          toast({
            title: "Conta criada com sucesso!",
            description: "Você já pode fazer login.",
          });
          setLoading(false);
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
    toast({
      title: `Autenticando com ${provider}...`,
      description: "Redirecionando para o provedor de autenticação.",
    });
    
    setTimeout(() => {
      navigate('/dashboard');
      setLoading(false);
    }, 1500);
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
              {view === 'login' && 'Entrar na Streaming Galaxy'}
              {view === 'signup' && 'Criar uma conta'}
              {view === 'reset-password' && 'Recuperar senha'}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {view === 'login' && 'Entre com sua conta para acessar o conteúdo'}
              {view === 'signup' && 'Preencha os dados para criar sua conta'}
              {view === 'reset-password' && 'Enviaremos um link para redefinir sua senha'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {view === 'signup' && (
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-200">
                    Nome completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 flex h-12 w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Digite seu nome completo"
                      required
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-200">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
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
                    <label htmlFor="password" className="text-sm font-medium text-gray-200">
                      Senha
                    </label>
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
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 flex h-12 w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="********"
                      required
                    />
                  </div>
                </div>
              )}
              
              {view === 'signup' && (
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-200">
                    Confirmar senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 flex h-12 w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="********"
                      required
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
                    {view === 'signup' && 'Criar conta'}
                    {view === 'reset-password' && 'Enviar link de recuperação'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </span>
                )}
              </Button>
            </form>
            
            {view !== 'reset-password' && (
              <>
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-700" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-black px-2 text-gray-400">ou continue com</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => handleSocialLogin('Google')}
                    className="h-12 bg-transparent border-gray-700 text-white hover:bg-gray-800"
                    disabled={loading}
                  >
                    <GoogleIcon className="mr-2 h-5 w-5 text-red-500" />
                    Google
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => handleSocialLogin('Facebook')}
                    className="h-12 bg-transparent border-gray-700 text-white hover:bg-gray-800"
                    disabled={loading}
                  >
                    <Facebook className="mr-2 h-5 w-5 text-blue-500" />
                    Facebook
                  </Button>
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex flex-wrap items-center justify-center space-x-2">
            <div className="text-center text-sm text-gray-400">
              {view === 'login' ? (
                <>
                  <span>Não tem uma conta? </span>
                  <button
                    onClick={() => setView('signup')}
                    className="text-primary hover:underline focus:outline-none"
                  >
                    Criar conta
                  </button>
                </>
              ) : (
                <>
                  <span>Já tem uma conta? </span>
                  <button
                    onClick={() => setView('login')}
                    className="text-primary hover:underline focus:outline-none"
                  >
                    Entrar
                  </button>
                </>
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
