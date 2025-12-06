import React from 'react';

interface AppleInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export function AppleInput({ placeholder, value, onChange, className = '' }: AppleInputProps) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`h-11 px-4 rounded-xl bg-[#F7F7F8] border border-[#E5E5E8] focus:border-[#007AFF] focus:outline-none transition-colors ${className}`}
    />
  );
}
