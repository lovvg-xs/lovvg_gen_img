import React from 'react';
import SpinnerIcon from './icons/SpinnerIcon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, className, variant = 'primary', isLoading = false, ...props }) => {
  const baseClasses = 'px-4 py-2 text-sm md:text-base uppercase tracking-widest text-white border-2 border-black active:translate-y-px active:translate-x-px transition-transform focus:outline-none flex items-center justify-center gap-2';
  
  const variantClasses = {
    primary: 'bg-cyan-500 hover:bg-cyan-600 shadow-[4px_4px_0_0_#00A3C4]',
    secondary: 'bg-gray-500 hover:bg-gray-600 shadow-[4px_4px_0_0_#4A5568]',
    danger: 'bg-red-500 hover:bg-red-600 shadow-[4px_4px_0_0_#C53030]',
  };
  
  const disabledClasses = 'disabled:bg-gray-700 disabled:shadow-none disabled:cursor-not-allowed disabled:text-gray-400';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <SpinnerIcon className="w-5 h-5" />}
      <span>{children}</span>
    </button>
  );
};

export default Button;