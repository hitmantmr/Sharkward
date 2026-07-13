import React from 'react';
import { useApp } from '../context/AppContext';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastContainer = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div style={styles.container}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            ...styles.toast,
            ...styles[toast.type] || styles.info
          }}
          className="fade-in"
        >
          <div style={styles.iconContainer}>
            {toast.type === 'success' && <CheckCircle size={18} color="#00ff88" />}
            {toast.type === 'error' && <AlertCircle size={18} color="#eb4b4b" />}
            {toast.type === 'info' && <Info size={18} color="#00f0ff" />}
          </div>
          <div style={styles.message}>{toast.message}</div>
          <button onClick={() => removeToast(toast.id)} style={styles.closeBtn}>
            <X size={14} color="#9ca3af" />
          </button>
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxWidth: '380px',
    width: '100%',
  },
  toast: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    borderRadius: '12px',
    background: 'rgba(16, 22, 35, 0.95)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
    color: '#f3f4f6',
    fontSize: '0.9rem',
    lineHeight: '1.4',
  },
  iconContainer: {
    marginRight: '12px',
    display: 'flex',
    alignItems: 'center',
  },
  message: {
    flex: 1,
    fontWeight: 500,
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    marginLeft: '12px',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '4px',
    transition: 'background 0.2s',
    ':hover': {
      background: 'rgba(255, 255, 255, 0.05)',
    }
  },
  // Border accent types
  success: {
    borderLeft: '4px solid #00ff88',
  },
  error: {
    borderLeft: '4px solid #eb4b4b',
  },
  info: {
    borderLeft: '4px solid #00f0ff',
  }
};

export default ToastContainer;
