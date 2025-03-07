
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  redirectPath?: string;
  children?: React.ReactNode;
}

const ProtectedRoute = ({ 
  redirectPath = '/login',
  children 
}: ProtectedRouteProps) => {
  const { user, loading } = useUser();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    // Wait for the user context to finish loading
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
    // Redirect to login with a return URL
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
