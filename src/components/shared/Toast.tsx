import { useEffect } from 'react';

export interface ToastMessage {
  id: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastProps {
  message: ToastMessage | null;
  onClose: () => void;
  duration?: number;
}

/**
 * Toast component using DaisyUI toast and alert
 * Displays a temporary notification message with optional action button
 */
const Toast = ({ message, onClose, duration = 6000 }: ToastProps) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  // Map toast type to DaisyUI alert classes
  const alertClass =
    message.type === 'error'
      ? 'alert-error'
      : message.type === 'success'
      ? 'alert-success'
      : message.type === 'warning'
      ? 'alert-warning'
      : 'alert-info';

  return (
    <div className='toast toast-center toast-top z-50 mt-4 w-full max-w-lg px-4'>
      <div
        className={`alert alert-soft alert-vertical sm:alert-horizontal items-center gap-3 ${alertClass} shadow-lg w-full`}
      >
        <span className='text-center'>{message.message}</span>
        {message.action && (
          <button
            className='btn btn-sm'
            onClick={() => {
              message.action?.onClick();
              onClose();
            }}
          >
            {message.action.label}
          </button>
        )}
      </div>
    </div>
  );
};

export default Toast;
