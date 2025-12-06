import React from 'react';

interface AppleButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  className?: string;
}

export function AppleButton({ children, variant = 'primary', onClick, className = '' }: AppleButtonProps) {
  const baseStyles = "px-5 py-3 rounded-xl transition-all duration-200";
  
  const variantStyles = {
    primary: "bg-[#007AFF] text-white hover:bg-[#0066DD] shadow-sm",
    secondary: "bg-white text-gray-900 border border-[#D5D5D9] hover:border-[#B5B5BD] shadow-sm"
  };

  return (
    <button 
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
