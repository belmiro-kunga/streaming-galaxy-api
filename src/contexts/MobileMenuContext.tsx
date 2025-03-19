
import React, { createContext, useContext, useState } from 'react';

interface MobileMenuContextProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const MobileMenuContext = createContext<MobileMenuContextProps | undefined>(undefined);

export const MobileMenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return (
    <MobileMenuContext.Provider value={{ isOpen, onOpen, onClose }}>
      {children}
    </MobileMenuContext.Provider>
  );
};

export const useMobileMenu = () => {
  const context = useContext(MobileMenuContext);
  if (context === undefined) {
    throw new Error('useMobileMenu must be used within a MobileMenuProvider');
  }
  return context;
};
