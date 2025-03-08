
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Shield } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/lib/supabase/client';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, refreshUserData } = useUser();
  
  // Check if user is already logged in and has admin role
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        console.log("Admin login - User data:", user);
        const userRole = user?.user_metadata?.role;
        console.log("Admin login - User role:", userRole);
        
        if (userRole === 'admin' || userRole === 'super_admin' || userRole === 'editor') {
          console.log(`Redirecting to admin dashboard - User is ${userRole}`);
          navigate('/admin-dashboard');
        }
      }
    };
    
    checkAdminStatus();
  }, [user, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log("Admin login - Attempting login with:", email);
      
      // For testing purposes, use these credentials:
      // admin@test.com / admin123 (role: admin)
      // editor@test.com / editor123 (role: editor)
      // super@test.com / super123 (role: super_admin)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Admin login - Error signing in:", error.message);
        throw error;
      }
      
      if (!data.user) {
        throw new Error("Admin login - No user data returned");
      }
      
      console.log("Admin login - Login successful, user data:", data.user);
      
      // Force refresh user data to get latest metadata
      await refreshUserData();
      
      // Get user role from metadata
      const userRole = data.user.user_metadata?.role;
      console.log("Admin login - User role after login:", userRole);
      
      if (userRole === 'admin' || userRole === 'super_admin' || userRole === 'editor') {
        toast({
          title: "Login bem-sucedido",
          description: `Bem-vindo ${userRole === 'super_admin' ? 'Super Admin' : userRole === 'admin' ? 'Administrador' : 'Editor'}!`
        });
        
        // Important: Wait a moment for user context to update before redirecting
        setTimeout(() => {
          console.log("Admin login - Redirecting to admin dashboard");
          navigate('/admin-dashboard');
        }, 1000); // Longer delay to ensure context is updated
      } else {
        console.error("Admin login - User doesn't have admin privileges:", userRole);
        await supabase.auth.signOut();
        toast({
          title: "Acesso negado",
          description: "Você não tem permissões de administrador.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error("Admin login - Error during login:", error);
      toast({
        title: "Erro de login",
        description: error.message || "Falha na autenticação. Verifique suas credenciais.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // For development purposes, provide test credentials
  const handleTestAdminCredentials = () => {
    setEmail('admin@test.com');
    setPassword('admin123');
  };
  
  const handleTestEditorCredentials = () => {
    setEmail('editor@test.com');
    setPassword('editor123');
  };
  
  const handleTestSuperAdminCredentials = () => {
    setEmail('super@test.com');
    setPassword('super123');
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <Card className="w-full max-w-md bg-gray-900 border-gray-800">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="bg-primary rounded-full p-3 mb-2">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Entre com suas credenciais de administrador
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                placeholder="admin@exemplo.com" 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
              </div>
              <Input 
                id="password" 
                placeholder="••••••••" 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            
            {/* Test credentials helper */}
            {process.env.NODE_ENV !== 'production' && (
              <div className="pt-2 text-xs text-gray-500">
                <p className="mb-1">Credenciais de teste:</p>
                <div className="flex space-x-2">
                  <button 
                    type="button"
                    onClick={handleTestAdminCredentials}
                    className="text-xs underline"
                  >
                    Admin
                  </button>
                  <button 
                    type="button"
                    onClick={handleTestEditorCredentials}
                    className="text-xs underline"
                  >
                    Editor
                  </button>
                  <button 
                    type="button"
                    onClick={handleTestSuperAdminCredentials}
                    className="text-xs underline"
                  >
                    Super Admin
                  </button>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
