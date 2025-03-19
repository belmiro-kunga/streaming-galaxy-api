
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { StreamingServiceProps } from '@/types/ui';

export const StreamingServiceCard = ({ name, logo, color, link }: StreamingServiceProps) => {
  // Check if we're in TV mode (larger screens)
  const isTVMode = window.innerWidth >= 1920;
  
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className={`flex-shrink-0 w-28 sm:w-32 md:w-40 ${isTVMode ? 'lg:w-48 xl:w-56' : ''}`}
      // Add focus styles for TV remote navigation
      whileFocus={{ scale: 1.05, boxShadow: "0 0 0 3px rgba(255,255,255,0.5)" }}
    >
      <Link to={link}>
        <Card 
          className={`h-24 sm:h-28 md:h-32 ${isTVMode ? 'lg:h-40 xl:h-44' : ''} 
            flex flex-col items-center justify-center p-3 ${color} shadow-lg 
            transition-all duration-300 cursor-pointer overflow-hidden border-none
            focus-visible:ring-4 focus-visible:ring-white`}
          tabIndex={0}
        >
          <div className="flex flex-col items-center justify-center h-full w-full">
            <img 
              src={logo} 
              alt={name} 
              className={`w-12 h-12 md:w-16 md:h-16 ${isTVMode ? 'lg:w-20 lg:h-20' : ''} object-contain`}
            />
            <p className={`mt-2 text-xs md:text-sm ${isTVMode ? 'lg:text-base xl:text-lg' : ''} font-medium text-white text-center`}>
              {name}
            </p>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
};
