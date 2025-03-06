
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { SocialLoginButtons } from '@/components/auth/SocialLoginButtons';
import { AuthDivider } from '@/components/auth/AuthDivider';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { motion } from 'framer-motion';

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
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-gray-900">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md shadow-xl rounded-lg overflow-hidden bg-card dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-foreground dark:text-white">
            {view === 'login' ? 'Login' : view === 'signup' ? 'Criar conta' : 'Redefinir senha'}
          </CardTitle>
          <CardDescription className="text-muted-foreground dark:text-gray-400">
            {view === 'login'
              ? 'Entre com seu e-mail e senha'
              : view === 'signup'
              ? 'Crie uma nova conta'
              : 'Redefina sua senha'}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <motion.div 
            className="space-y-4"
            key={view}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {(view === 'login' || view === 'reset') && (
              <>
                <SocialLoginButtons isLoading={isLoading} setIsLoading={setIsLoading} />
                <AuthDivider />
              </>
            )}

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
          <CardFooter className="pb-8 flex justify-center">
            <p className="dark:text-gray-300">
              Não tem uma conta?{' '}
              <button
                type="button"
                onClick={() => setView('signup')}
                className="text-primary dark:text-violet-400 hover:text-primary/90 dark:hover:text-violet-300 font-medium hover:underline transition-colors"
              >
                Criar conta
              </button>
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default Login;
