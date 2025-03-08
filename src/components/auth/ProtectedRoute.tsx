
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  redirectPath?: string;
  children?: React.ReactNode;
  requiredRole?: 'admin' | 'editor' | 'super_admin';
}

const ProtectedRoute = ({ 
  redirectPath = '/login',
  children,
  requiredRole
}: ProtectedRouteProps) => {
  const { user, loading, refreshUserData } = useUser();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  
  // When component mounts, refresh user data to ensure we have the latest metadata
  useEffect(() => {
    const refreshData = async () => {
      if (!loading) {
        // Only refresh if not already loading
        if (user) {
          console.log("ProtectedRoute - Refreshing user data for role check");
          await refreshUserData();
        }
        setIsChecking(false);
      }
    };
    
    refreshData();
  }, [loading, refreshUserData, user]);

  if (loading || isChecking) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Check if user is authenticated
  if (!user) {
    console.log("ProtectedRoute: No user found, redirecting to", redirectPath);
    // Redirect to login with a return URL
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // If role is required, check if user has the required role
  if (requiredRole) {
    // Get user role from user metadata
    const userRole = user?.user_metadata?.role;
    console.log("ProtectedRoute - Checking role access:", { requiredRole, userRole });
    
    // Check each role type
    const isAdmin = userRole === 'admin' || userRole === 'super_admin';
    const isSuperAdmin = userRole === 'super_admin';
    const isEditor = userRole === 'editor';
    
    // Log the role check process for debugging
    console.log('ProtectedRoute - Role check:', { 
      requiredRole, 
      userRole, 
      isAdmin, 
      isSuperAdmin, 
      isEditor 
    });
    
    // Determine if user has access based on required role
    const hasAccess = 
      (requiredRole === 'admin' && isAdmin) ||
      (requiredRole === 'super_admin' && isSuperAdmin) ||
      (requiredRole === 'editor' && (isEditor || isAdmin));
    
    console.log('ProtectedRoute - Access decision:', hasAccess);

    if (!hasAccess) {
      console.log("ProtectedRoute: User doesn't have required role, redirecting to /home");
      // Redirect to home if user doesn't have the required role
      return <Navigate to="/home" replace />;
    }
  }

  console.log("ProtectedRoute: Access granted");
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
