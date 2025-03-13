
import React from 'react';
import { AdminDashboardProvider, useAdminDashboard } from '@/contexts/admin';
import DashboardLayout from '@/components/admin/dashboard/DashboardLayout';
import { useQuery } from '@tanstack/react-query';
import { planAPI } from '@/services/plans';
import { supabase } from '@/lib/supabase';

const AdminDashboard = () => {
  return (
    <AdminDashboardProvider>
      <AdminDashboardContent />
    </AdminDashboardProvider>
  );
};

// This internal component allows us to use the context hooks
const AdminDashboardContent = () => {
  const { setSubscriptionPlans, setUsers } = useAdminDashboard();

  // Use React Query to fetch subscription plans
  const plansQuery = useQuery({
    queryKey: ['subscriptionPlans'],
    queryFn: planAPI.getAllPlans,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Use React Query to fetch users from Supabase
  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles_view').select('*');
      
      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
      
      // Format users to match the User type in our application
      return data.map(user => ({
        id: user.id || `USR-${Math.random().toString(36).substring(2, 10)}`,
        name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unknown User',
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        country: user.country || 'Angola',
        province: user.province || '',
        created_at: user.created_at ? new Date(user.created_at).toISOString().split('T')[0] : '',
        status: 'Ativo', // Default status
        subscription: null // Default subscription
      }));
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchOnWindowFocus: false,
  });

  // When data changes and is available, update the context
  React.useEffect(() => {
    if (plansQuery.data) {
      setSubscriptionPlans(plansQuery.data);
    }
  }, [plansQuery.data, setSubscriptionPlans]);

  // When users data changes and is available, update the context
  React.useEffect(() => {
    if (usersQuery.data) {
      setUsers(usersQuery.data);
    }
  }, [usersQuery.data, setUsers]);

  // If there was an error fetching the plans, we could show an error message
  if (plansQuery.error) {
    console.error('Error fetching subscription plans:', plansQuery.error);
  }

  // If there was an error fetching the users, we could show an error message
  if (usersQuery.error) {
    console.error('Error fetching users:', usersQuery.error);
  }

  return <DashboardLayout />;
};

export default AdminDashboard;
