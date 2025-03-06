
import { useState, useCallback } from 'react';
import { User } from '../types';

export const useUsersList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Computed users based on search
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    users,
    setUsers,
    searchQuery,
    setSearchQuery,
    filteredUsers
  };
};
