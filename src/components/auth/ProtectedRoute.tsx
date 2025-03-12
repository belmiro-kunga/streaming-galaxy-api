import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  redirectPath?: string;
  children?: React.ReactNode;
  requiresAdmin?: boolean;
}

const ProtectedRoute = ({ 
  redirectPath = '/login',
  children,
  requiresAdmin = false
}: ProtectedRouteProps) => {
  const [isChecking, setIsChecking] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    // Verifica se existe usuário no localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
      }
    }
    setIsChecking(false);
  }, []);

  if (isChecking) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }

  // Verificar permissões de admin se necessário
  if (requiresAdmin) {
    const userRole = user.user_metadata?.role;
    const isAdmin = ['admin', 'super_admin', 'editor'].includes(userRole);
    
    if (!isAdmin) {
      // Se não for admin, redirecionar para o dashboard do usuário
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
