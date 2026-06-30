import React from 'react';
import { useScheduleStore } from '../../stores/useScheduleStore';
import './ToastContainer.css';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useScheduleStore();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        let icon = '🔔';
        if (toast.type === 'success') icon = '✅';
        if (toast.type === 'error') icon = '❌';
        if (toast.type === 'warning') icon = '⚠️';

        return (
          <div
            key={toast.id}
            className={`toast toast-${toast.type}`}
            onClick={() => removeToast(toast.id)}
            role="alert"
          >
            <span className="toast-icon">{icon}</span>
            <span className="toast-message">{toast.message}</span>
            <button
              className="toast-close"
              onClick={(e) => {
                e.stopPropagation();
                removeToast(toast.id);
              }}
              aria-label="Fechar"
            >
              &times;
            </button>
          </div>
        );
      })}
    </div>
  );
};
