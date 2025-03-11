import React from 'react';
import { Layout } from '@/components/ui/Layout';
import { motion } from 'framer-motion';

interface StreamingLayoutProps {
  children: React.ReactNode;
  title: string;
  backgroundImage: string;
}

export const StreamingLayout = ({ children, title, backgroundImage }: StreamingLayoutProps) => {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative w-full h-[50vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={backgroundImage}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black from-20% via-black/50 to-transparent" />
        </div>
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4 md:px-8 lg:px-12">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg"
            >
              {title}
            </motion.h1>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="px-4 md:px-8 py-8 space-y-12 bg-black min-h-screen"
      >
        {children}
      </motion.main>
    </Layout>
  );
}; 