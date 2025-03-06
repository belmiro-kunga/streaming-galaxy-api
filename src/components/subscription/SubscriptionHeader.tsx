
import React from 'react';
import { motion } from 'framer-motion';

export const SubscriptionHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-12"
    >
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Escolha seu plano</h1>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Encontre o plano perfeito para sua experiência de streaming. Todos os planos incluem acesso ao nosso catálogo completo.
      </p>
    </motion.div>
  );
};
