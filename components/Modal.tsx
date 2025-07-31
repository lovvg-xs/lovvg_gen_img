
import React from 'react';
import CloseIcon from './icons/CloseIcon';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 text-white border-4 border-black shadow-[8px_8px_0_0_#000] w-full max-w-3x1 p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 pb-2 border-b-2 border-gray-600">
          <h2 className="text-xl text-cyan-400 uppercase">{title}</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-red-500 transition-colors"
          >
            <CloseIcon className="w-8 h-8"/>
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;