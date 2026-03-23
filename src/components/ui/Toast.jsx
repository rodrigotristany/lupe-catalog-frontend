// Toast notifications are handled by react-hot-toast.
// This file re-exports a pre-configured Toaster component.
import { Toaster } from 'react-hot-toast';

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#fff',
          color: '#1f2937',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          borderRadius: '0.75rem',
          fontSize: '0.875rem',
        },
        success: {
          iconTheme: { primary: '#d47a2e', secondary: '#fff' },
        },
      }}
    />
  );
}
