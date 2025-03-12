import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Simula login automático como usuário comum
    const regularUser = {
      id: 'user-1',
      email: 'user@cineplay.com',
      user_metadata: {
        role: 'user',
        name: 'Usuário',
        first_name: 'João',
        last_name: 'Silva',
        phone: '123456789',
        country: 'Angola',
        province: 'Luanda'
      }
    };
    
    // Salva no localStorage
    localStorage.setItem('user', JSON.stringify(regularUser));
    
    // Redireciona para o dashboard do usuário
    navigate('/dashboard');
  }, [navigate]);

  return null;
};

export default Login;
