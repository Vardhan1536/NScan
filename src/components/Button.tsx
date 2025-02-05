import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  children, 
  className = '',
  ...props 
}) => {
  const baseStyles = 'px-6 py-3 rounded-lg font-medium transition-colors duration-200';
  const variants = {
    primary: 'bg-[#646cff] text-white hover:bg-[#5058cc]',
    secondary: 'bg-[#e6e6ff] text-[#646cff] hover:bg-[#d1d1ff]'
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};