
import { useContext } from 'react';
import { AdminDashboardContext } from './AdminDashboardProvider';

// Hook for using the context
export const useAdminDashboard = () => {
  const context = useContext(AdminDashboardContext);
  if (!context) {
    throw new Error('useAdminDashboard must be used within an AdminDashboardProvider');
  }
  return context;
};
