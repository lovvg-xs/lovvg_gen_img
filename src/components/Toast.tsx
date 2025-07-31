import React, { useEffect, useState } from 'react';
import ErrorIcon from './icons/ErrorIcon';

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
}

const Toast: React.FC<ToastProps> = ({ message, type, isVisible }) => {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
    } else {
      // Allows the fade-out animation to complete before unmounting
      const timer = setTimeout(() => setShow(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!show) return null;

  const typeClasses = {
    success: 'bg-green-500 shadow-[4px_4px_0_0_#2F855A]',
    error: 'bg-red-500 shadow-[4px_4px_0_0_#C53030]',
    info: 'bg-blue-500 shadow-[4px_4px_0_0_#2B6CB0]',
  };

  const animationClass = isVisible ? 'animate-toast-in' : 'animate-toast-out';

  return (
    <div
      className={`fixed top-5 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm p-4 text-white border-2 border-black flex items-center gap-4 ${typeClasses[type]} ${animationClass}`}
      role="alert"
    >
      {type === 'error' && <ErrorIcon className="w-6 h-6 flex-shrink-0" />}
      <p className="text-sm">{message}</p>
    </div>
  );
};

export default Toast;