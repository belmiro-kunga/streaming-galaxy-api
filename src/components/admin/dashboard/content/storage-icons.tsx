
import React from 'react';

export const WasabiIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect width="24" height="24" rx="4" fill="#00CE3E" fillOpacity="0.1" />
    <path
      d="M7.5 12L10.5 7.5H13.5L10.5 12L13.5 16.5H10.5L7.5 12Z"
      fill="#00CE3E"
    />
    <path
      d="M13.5 12L16.5 7.5H19.5L16.5 12L19.5 16.5H16.5L13.5 12Z"
      fill="#00CE3E"
    />
    <path
      d="M4.5 7.5H7.5L10.5 12L7.5 16.5H4.5L7.5 12L4.5 7.5Z"
      fill="#00CE3E"
    />
  </svg>
);

export const CloudflareIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect width="24" height="24" rx="4" fill="#F38020" fillOpacity="0.1" />
    <path
      d="M12.9 13.7C12.9 12.6 13.8 11.7 14.9 11.7C15.1 11.7 15.3 11.7 15.4 11.8C15.2 10.6 14.1 9.7 12.9 9.7C11.5 9.7 10.4 10.8 10.4 12.2C10.4 12.3 10.4 12.5 10.4 12.6C9.8 12.7 9.3 13.2 9.3 13.9C9.3 14.5 9.8 15 10.4 15H15.3C16 15 16.6 14.4 16.6 13.7C16.6 13 16 12.4 15.3 12.4C15.3 12.4 15.2 12.4 15.1 12.4C15 13.1 14.5 13.7 13.8 13.7H12.9Z"
      fill="#F38020"
    />
    <path
      d="M11.6 11.8C11.6 11.8 11.6 11.8 11.6 11.8C11.6 10.7 10.7 9.9 9.6 9.9C8.6 9.9 7.9 10.5 7.7 11.3C7.6 11.3 7.6 11.3 7.5 11.3C6.7 11.3 6 12 6 12.8C6 13.6 6.7 14.3 7.5 14.3H11.8C12.5 14.3 13.1 13.7 13.1 13C13.1 12.3 12.5 11.7 11.8 11.7C11.7 11.7 11.7 11.8 11.6 11.8Z"
      fill="#FAAE40"
    />
  </svg>
);

export const YoutubeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect width="24" height="24" rx="4" fill="#FF0000" fillOpacity="0.1" />
    <path
      d="M19.5 7.5C19.5 6.12 18.38 5 17 5H7C5.62 5 4.5 6.12 4.5 7.5V16.5C4.5 17.88 5.62 19 7 19H17C18.38 19 19.5 17.88 19.5 16.5V7.5ZM10.5 15.75V8.25L15 12L10.5 15.75Z"
      fill="#FF0000"
    />
  </svg>
);

export const DirectLinkIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect width="24" height="24" rx="4" fill="#3B82F6" fillOpacity="0.1" />
    <path
      d="M8 12H16M12.5 8L16.5 12L12.5 16"
      stroke="#3B82F6"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
