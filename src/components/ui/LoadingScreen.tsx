import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black"
    >
      {/* Overlay com padrão de pontos */}
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(59, 130, 246, 0.05) 2%, transparent 0%), 
                           radial-gradient(circle at 75px 75px, rgba(59, 130, 246, 0.05) 2%, transparent 0%)`,
          backgroundSize: '100px 100px'
        }} 
      />

      <div className="relative">
        {/* Círculos decorativos com opacidade ajustada */}
        <div className="absolute -left-20 -top-20 w-40 h-40 bg-blue-500/5 rounded-full blur-md" />
        <div className="absolute -right-20 -bottom-20 w-40 h-40 bg-blue-500/5 rounded-full blur-md" />
        
        {/* Container do Logo/Ícone */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8"
        >
          {/* Logo ou Ícone */}
          <div className="w-24 h-24 relative">
            {/* Círculo de loading externo */}
            <motion.div
              className="absolute inset-0 border-4 border-gray-700 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Círculo de loading interno */}
            <motion.div
              className="absolute inset-2 border-4 border-t-blue-500 border-blue-500/10 rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Ícone central */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg shadow-lg" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Texto de loading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-[20%] left-0 right-0 text-center"
      >
        <h2 className="text-gray-300 text-2xl font-bold mb-2">
          Carregando
        </h2>
        <div className="flex items-center justify-center gap-1.5">
          <motion.div
            className="w-2 h-2 bg-blue-500 rounded-full"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className="w-2 h-2 bg-blue-500 rounded-full"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
          />
          <motion.div
            className="w-2 h-2 bg-blue-500 rounded-full"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoadingScreen; 