import React from 'react';

interface AppleCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function AppleCard({ children, className = '', hover = false }: AppleCardProps) {
  const hoverStyles = hover ? 'hover:shadow-lg hover:-translate-y-0.5 cursor-pointer' : '';
  
  return (
    <div className={`bg-white rounded-2xl shadow-sm transition-all duration-200 ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
}
