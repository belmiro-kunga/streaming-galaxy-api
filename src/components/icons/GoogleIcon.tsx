
import React from 'react';

export const GoogleIcon = ({ className = "", size = 24, ...props }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      {...props}
    >
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M8 12 h8"></path>
      <path d="M12 8 v8"></path>
    </svg>
  );
};
