
import { useState } from 'react';
import { useAdminDashboard } from '@/contexts/admin/AdminDashboardContext';
import { StorageConfig } from './types';

export const useFileStore = () => {
  const { wasabiConfig, cloudflareConfig, setWasabiConfig, setCloudflareConfig } = useAdminDashboard();

  const handleWasabiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Wasabi Config:', wasabiConfig);
    // Implementar lógica de salvamento
  };

  const handleCloudflareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Cloudflare Config:', cloudflareConfig);
    // Implementar lógica de salvamento
  };

  const handleDefaultChange = (provider: string, isDefault: boolean) => {
    if (isDefault) {
      // Se este provedor está sendo definido como padrão, desativa o outro
      if (provider === 'wasabi') {
        setWasabiConfig({ ...wasabiConfig, isDefault: true });
        setCloudflareConfig({ ...cloudflareConfig, isDefault: false });
      } else {
        setWasabiConfig({ ...wasabiConfig, isDefault: false });
        setCloudflareConfig({ ...cloudflareConfig, isDefault: true });
      }
    } else {
      // Se está sendo desativado, apenas atualiza este provedor
      if (provider === 'wasabi') {
        setWasabiConfig({ ...wasabiConfig, isDefault: false });
      } else {
        setCloudflareConfig({ ...cloudflareConfig, isDefault: false });
      }
    }
  };

  return {
    wasabiConfig,
    cloudflareConfig,
    setWasabiConfig,
    setCloudflareConfig,
    handleWasabiSubmit,
    handleCloudflareSubmit,
    handleDefaultChange
  };
};
