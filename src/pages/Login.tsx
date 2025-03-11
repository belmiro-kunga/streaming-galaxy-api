import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { SocialLoginButtons } from '@/components/auth/SocialLoginButtons';
import { AuthDivider } from '@/components/auth/AuthDivider';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { motion } from 'framer-motion';

const LoginIllustration = () => (
  <div className="relative w-full h-full flex items-center justify-center bg-[#00B2FF]">
    <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72">
      <div className="absolute w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-white/20 rounded-full -left-12 -bottom-6 md:-left-16 md:-bottom-8" />
      <div className="absolute w-20 h-20 sm:w-22 sm:h-22 md:w-24 md:h-24 bg-white/20 rounded-full -right-6 -top-6 md:-right-8 md:-top-8" />
      <div className="relative">
        <div className="w-36 h-48 sm:w-40 sm:h-56 md:w-48 md:h-64 bg-gray-200 rounded-3xl mx-auto" />
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
          <div className="w-10 h-16 sm:w-11 sm:h-18 md:w-12 md:h-20 bg-[#0066FF] relative">
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-white rounded-full" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

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

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4">
      {/* Background com gradiente e padrão */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#00B2FF] via-[#1E90FF] to-[#0066FF] opacity-90">
        {/* Padrão de fundo */}
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.2) 2%, transparent 0%), 
                           radial-gradient(circle at 75px 75px, rgba(255,255,255,0.2) 2%, transparent 0%)`,
          backgroundSize: '100px 100px'
        }} />
      </div>

      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Card de Login */}
      <Card className="w-full max-w-[380px] sm:max-w-[420px] md:max-w-[440px] shadow-2xl rounded-lg overflow-hidden bg-white/95 dark:bg-gray-800/95 dark:border-gray-700 backdrop-blur-sm relative z-10">
        <CardHeader className="text-center pt-6 sm:pt-8">
          <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            {view === 'login' ? 'LOGIN' : view === 'signup' ? 'CRIAR CONTA' : 'REDEFINIR SENHA'}
          </CardTitle>
          {view === 'login' && (
            <CardDescription className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">
              Bem-vindo de volta! Por favor, entre em sua conta.
            </CardDescription>
          )}
        </CardHeader>
        
        <CardContent className="p-4 sm:p-6 md:p-8">
          <motion.div 
            className="space-y-6"
            key={view}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <SocialLoginButtons isLoading={isLoading} setIsLoading={setIsLoading} />
            
            <AuthDivider message="Ou faça login com e-mail" />

            {view === 'login' && (
              <LoginForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                setView={setView}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            )}

            {view === 'signup' && (
              <SignupForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                country={country}
                province={province}
                setProvince={setProvince}
                setView={setView}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            )}

            {view === 'reset' && (
              <ResetPasswordForm
                email={email}
                setEmail={setEmail}
                setView={setView}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            )}
          </motion.div>
        </CardContent>
        
        {view === 'login' && (
          <CardFooter className="pb-6 sm:pb-8 flex justify-center">
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Não tem uma conta?{' '}
              <button
                type="button"
                onClick={() => setView('signup')}
                className="text-[#00B2FF] hover:text-[#0066FF] font-medium hover:underline transition-colors"
              >
                Inscrever-se
              </button>
            </p>
          </CardFooter>
        )}
      </Card>

      {/* Círculos decorativos */}
      <div className="fixed bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
      <div className="fixed top-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
    </div>
  );
};

export default Login;
