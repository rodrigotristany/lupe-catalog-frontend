import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoginForm } from '../components/admin/LoginForm';
import lupeLogo from '../assets/lupe_magenta.svg';

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

      <div className="min-h-screen bg-lupe-light-blue flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm">
          <img src={lupeLogo} alt="LUPE" className="h-10 w-auto mx-auto mb-6" />
          <LoginForm />
        </div>
      </div>
    </>
  );
}
