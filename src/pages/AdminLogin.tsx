
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Simula login automático como administrador
    const adminUser = {
      id: 'admin-1',
      email: 'admin@cineplay.com',
      user_metadata: {
        role: 'admin',
        name: 'Administrador'
      }
    };
    
    // Salva no localStorage
    localStorage.setItem('user', JSON.stringify(adminUser));
    
    // Redireciona para o dashboard com uma rota específica
    navigate('/admin-dashboard/overview');
  }, [navigate]);

  return null;
};

export default AdminLogin;
