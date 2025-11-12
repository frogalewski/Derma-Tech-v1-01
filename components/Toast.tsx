import React, { useEffect, useState } from 'react';

// Icons
const ErrorIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

interface ToastProps {
  id: number;
  message: string;
  type: 'error' | 'success' | 'info';
  onClose: (id: number) => void;
}

const toastConfig = {
    error: {
        bg: 'bg-red-500',
        icon: <ErrorIcon className="h-6 w-6 text-white" />,
    },
    success: {
        // Placeholder for future success toasts
        bg: 'bg-green-500',
        icon: <div />, 
    },
    info: {
        // Placeholder for future info toasts
        bg: 'bg-blue-500',
        icon: <div />,
    },
};

const Toast: React.FC<ToastProps> = ({ id, message, type, onClose }) => {
    const [isFadingOut, setIsFadingOut] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleClose();
        }, 5000); // Auto-close after 5 seconds

        return () => clearTimeout(timer);
    }, [id]);

    const handleClose = () => {
        setIsFadingOut(true);
        setTimeout(() => onClose(id), 300); // Match animation duration
    };

    const config = toastConfig[type];

    return (
        <div 
            role="alert"
            className={`
                relative flex items-center p-4 rounded-lg shadow-lg text-white w-full transition-all duration-300 ease-in-out transform
                ${config.bg}
                ${isFadingOut ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}
            `}
        >
            <div className="flex-shrink-0">{config.icon}</div>
            <div className="ml-3 mr-6 text-sm font-medium">{message}</div>
            <button
                onClick={handleClose}
                aria-label="Fechar notificação"
                className="absolute top-1/2 right-2 -translate-y-1/2 p-1 rounded-md text-white/70 hover:text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
            >
                <CloseIcon className="h-5 w-5" />
            </button>
        </div>
    );
};

export default Toast;
