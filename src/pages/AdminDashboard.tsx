
import React, { useEffect } from 'react';
import { AdminDashboardProvider } from '@/contexts/AdminDashboardContext';
import DashboardLayout from '@/components/admin/dashboard/DashboardLayout';
import { planAPI } from '@/services/plans';

const AdminDashboard = () => {
  return (
    <AdminDashboardProvider>
      <AdminDashboardContent />
    </AdminDashboardProvider>
  );
};

// This internal component allows us to use the context hooks
const AdminDashboardContent = () => {
  const { setSubscriptionPlans } = React.useContext(AdminDashboardContext);

  // Fetch subscription plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await planAPI.getAllPlans();
        setSubscriptionPlans(data);
      } catch (error) {
        console.error('Error fetching subscription plans:', error);
      }
    };
    
    fetchPlans();
  }, [setSubscriptionPlans]);

  return <DashboardLayout />;
};

export default AdminDashboard;
