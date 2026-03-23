import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoginForm } from '../components/admin/LoginForm';

export function AdminLoginPage() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/admin" replace />;
  return (
    <>
      <Helmet>
        <title>Admin Login | LUPE</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="min-h-screen bg-lupe-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm">
          <h1 className="font-display text-2xl font-bold text-lupe-800 mb-6 text-center">LUPE Admin</h1>
          <LoginForm />
        </div>
      </div>
    </>
  );
}
