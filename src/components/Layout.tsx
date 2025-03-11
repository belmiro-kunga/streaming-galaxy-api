import React from 'react';
import { Header } from './ui/Header';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div>{children}</div>
    </div>
  );
}; 