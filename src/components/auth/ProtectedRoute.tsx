
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
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
  const { user, loading } = useUser();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    if (!loading) {
      setIsChecking(false);
    }
  }, [loading]);

  if (isChecking) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
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
