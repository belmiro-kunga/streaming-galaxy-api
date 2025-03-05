
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Lock, X, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/lib/supabase';

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
        // Login with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        // Successful login
        navigate('/dashboard');
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo de volta à CinePlay.",
        });
      } else if (view === 'reset-password') {
        // Reset password with Supabase
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) throw error;

        toast({
          title: "Email enviado!",
          description: "Verifique seu email para redefinir sua senha.",
        });
        setLoading(false);
        setView('login');
      } else if (view === 'signup') {
        // Verify passwords match
        if (password !== confirmPassword) {
          toast({
            title: "Erro na criação da conta",
            description: "As senhas não coincidem.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        // Create account with Supabase
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
            },
          },
        });

        if (error) throw error;

        // Check if email confirmation is required
        if (data.user?.identities?.length === 0) {
          toast({
            title: "Verifique seu email",
            description: "Enviamos um link de confirmação para seu email.",
          });
          setView('login');
        } else {
          navigate('/dashboard');
          toast({
            title: "Conta criada com sucesso!",
            description: "Bem-vindo à CinePlay.",
          });
        }
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      toast({
        title: "Erro de autenticação",
        description: error.message || "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'facebook' | 'google') => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;
      
      // The redirect happens automatically, but we'll show loading state
    } catch (error: any) {
      console.error(`${provider} login error:`, error);
      toast({
        title: `Erro ao fazer login com ${provider}`,
        description: error.message || "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-950 to-gray-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-violet-800 bg-black/60 backdrop-blur-md shadow-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent pointer-events-none"></div>
          
          <CardHeader className="space-y-3 text-center relative z-10 px-6 pt-8 pb-2">
            <CardTitle className="text-3xl font-bold tracking-tight text-white">
              {view === 'login' && 'Bem-vindo à CinePlay'}
              {view === 'reset-password' && 'Recuperar senha'}
              {view === 'signup' && 'Criar uma conta'}
            </CardTitle>
            <CardDescription className="text-violet-200 max-w-sm mx-auto">
              {view === 'login' && 'Entre com sua conta para acessar todo o conteúdo'}
              {view === 'reset-password' && 'Enviaremos um link para redefinir sua senha'}
              {view === 'signup' && 'Preencha seus dados para criar uma nova conta'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 px-8 py-6 relative z-10">
            {/* Social login buttons only in login view */}
            {view === 'login' && (
              <div className="grid grid-cols-2 gap-5">
                <Button 
                  variant="outline" 
                  className="h-12 w-full bg-blue-600 border-0 hover:bg-blue-700 text-white font-medium"
                  onClick={() => handleSocialLogin('facebook')}
                  disabled={loading}
                >
                  <Facebook className="mr-2 h-5 w-5 text-white" />
                  Facebook
                </Button>
                <Button 
                  variant="outline" 
                  className="h-12 w-full bg-red-500 border-0 hover:bg-red-600 text-white font-medium"
                  onClick={() => handleSocialLogin('google')}
                  disabled={loading}
                >
                  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="white">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </Button>
              </div>
            )}

            {/* Separator only visible in login view */}
            {view === 'login' && (
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full bg-violet-700/50" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-background px-4 text-violet-300 bg-black/80 rounded-full py-1">
                    ou continue com email
                  </span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name field - only in signup view */}
              {view === 'signup' && (
                <div className="space-y-2.5">
                  <Label htmlFor="name" className="text-sm font-medium text-violet-100 block mb-1.5">
                    Nome completo
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex h-12 w-full rounded-md border border-violet-700/50 bg-black/50 px-3 py-2 text-sm text-white placeholder:text-violet-400/70 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    placeholder="Seu nome"
                    required={view === 'signup'}
                  />
                </div>
              )}

              {/* Email field - in all views */}
              <div className="space-y-2.5">
                <Label htmlFor="email" className="text-sm font-medium text-violet-100 block mb-1.5">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-5 w-5 text-violet-400 pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 flex h-12 w-full rounded-md border border-violet-700/50 bg-black/50 px-3 py-2 text-sm text-white placeholder:text-violet-400/70 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>
              
              {/* Password field - not in reset-password view */}
              {view !== 'reset-password' && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <Label htmlFor="password" className="text-sm font-medium text-violet-100">
                      Senha
                    </Label>
                    {view === 'login' && (
                      <button
                        type="button"
                        onClick={() => setView('reset-password')}
                        className="text-xs text-violet-300 hover:text-violet-200 hover:underline transition-colors"
                      >
                        Esqueceu a senha?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-violet-400 pointer-events-none" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 flex h-12 w-full rounded-md border border-violet-700/50 bg-black/50 px-3 py-2 text-sm text-white placeholder:text-violet-400/70 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      placeholder="********"
                      required={view !== 'reset-password'}
                    />
                  </div>
                </div>
              )}

              {/* Confirm password field - only in signup view */}
              {view === 'signup' && (
                <div className="space-y-2.5">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-violet-100 block mb-1.5">
                    Confirmar Senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-violet-400 pointer-events-none" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 flex h-12 w-full rounded-md border border-violet-700/50 bg-black/50 px-3 py-2 text-sm text-white placeholder:text-violet-400/70 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      placeholder="********"
                      required={view === 'signup'}
                    />
                  </div>
                </div>
              )}
              
              {/* Submit button */}
              <Button
                type="submit"
                className="w-full h-12 text-base bg-violet-600 hover:bg-violet-700 transition-colors mt-6"
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
          
          <CardFooter className="flex flex-wrap items-center justify-center pb-8 pt-2 relative z-10 px-6">
            <div className="text-center text-sm text-violet-200">
              {view === 'login' ? (
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
              ) : (
                // Here's the fix - ensuring we handle both reset-password and signup views correctly
                <p>
                  {view === 'signup' ? (
                    <>
                      Já tem uma conta?{' '}
                      <button
                        type="button"
                        onClick={() => setView('login')}
                        className="text-violet-300 hover:text-white font-medium hover:underline transition-colors"
                      >
                        Fazer login
                      </button>
                    </>
                  ) : (
                    // This is for reset-password view
                    <button
                      type="button"
                      onClick={() => setView('login')}
                      className="text-violet-300 hover:text-white font-medium hover:underline transition-colors"
                    >
                      Voltar para o login
                    </button>
                  )}
                </p>
              )}
            </div>
          </CardFooter>
        </Card>
        
        <div className="mt-8 text-center">
          <Link 
            to="/"
            className="text-sm text-violet-300 hover:text-white transition-colors inline-flex items-center"
          >
            <X className="mr-1 h-4 w-4" /> Cancelar e voltar
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
