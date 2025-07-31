import { useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastState {
  message: string;
  type: ToastType;
  isVisible: boolean;
}

export const useToast = () => {
  const [toast, setToast] = useState<ToastState>({ message: '', type: 'info', isVisible: false });

  const showToast = useCallback((message: string, type: ToastType = 'info', duration: number = 5000) => {
    setToast({ message, type, isVisible: true });

    setTimeout(() => {
      setToast(prev => ({ ...prev, isVisible: false }));
    }, duration);
  }, []);

  return { toast, showToast };
};
