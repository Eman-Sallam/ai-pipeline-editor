import { useEffect } from 'react';

export interface ToastMessage {
  id: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
}

interface ToastProps {
  message: ToastMessage | null;
  onClose: () => void;
  duration?: number;
}

/**
 * Toast component using DaisyUI toast and alert
 * Displays a temporary notification message
 */
const Toast = ({ message, onClose, duration = 5000 }: ToastProps) => {
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
    <div className='toast toast-center toast-top'>
      <div className={`alert alert-soft ${alertClass}`}>
        <span>{message.message}</span>
      </div>
    </div>
  );
};

export default Toast;
