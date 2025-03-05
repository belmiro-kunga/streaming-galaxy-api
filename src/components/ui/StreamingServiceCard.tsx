
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';

interface StreamingServiceProps {
  name: string;
  logo: string;
  color: string;
  link: string;
}

export const StreamingServiceCard = ({ name, logo, color, link }: StreamingServiceProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="flex-shrink-0 w-28 sm:w-32 md:w-40"
    >
      <Link to={link}>
        <Card 
          className={`h-24 sm:h-28 md:h-32 flex flex-col items-center justify-center p-3 ${color} shadow-lg transition-all duration-300 cursor-pointer overflow-hidden border-none`}
        >
          <div className="flex flex-col items-center justify-center h-full w-full">
            <img 
              src={logo} 
              alt={name} 
              className="w-12 h-12 md:w-16 md:h-16 object-contain"
            />
            <p className="mt-2 text-xs md:text-sm font-medium text-white text-center">{name}</p>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
};
