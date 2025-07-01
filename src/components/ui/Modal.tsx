import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onConfirm: () => void;
  confirmText?: string;
  confirmColor?: 'green' | 'red' | 'blue';
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
}

const Modal: React.FC<ModalProps> = ({
  title,
  children,
  onClose,
  onConfirm,
  confirmText = 'Confirm',
  confirmColor = 'blue',
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = ''
}) => {
  // Map confirm colors to Tailwind classes
  const colorMap = {
    green: 'bg-emerald-600 hover:bg-emerald-700',
    red: 'bg-red-600 hover:bg-red-700',
    blue: 'bg-blue-600 hover:bg-blue-700'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`w-full max-w-md rounded-lg border border-gray-200 bg-white p-0 shadow-lg ${className}`}>
        <div className={`flex items-center justify-between rounded-t-lg border-b border-gray-200 p-4 ${headerClassName}`}>
          <h3 className="text-lg font-semibold">{title}</h3>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className={`p-6 ${bodyClassName}`}>
          {children}
        </div>
        <div className={`flex justify-end gap-2 rounded-b-lg border-t border-gray-200 p-4 ${footerClassName}`}>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className={colorMap[confirmColor]} onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;