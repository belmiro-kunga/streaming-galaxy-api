
import React from 'react';
import { AdminDashboardProvider, useAdminDashboard } from '@/contexts/admin/AdminDashboardContext';
import DashboardLayout from '@/components/admin/dashboard/DashboardLayout';
import { useQuery } from '@tanstack/react-query';
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
  const { setSubscriptionPlans } = useAdminDashboard();

  // Use React Query to fetch subscription plans
  const { isLoading, error } = useQuery({
    queryKey: ['subscriptionPlans'],
    queryFn: planAPI.getAllPlans,
    onSuccess: (data) => {
      setSubscriptionPlans(data);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // If there was an error fetching the plans, we could show an error message
  if (error) {
    console.error('Error fetching subscription plans:', error);
  }

  return <DashboardLayout />;
};

export default AdminDashboard;
