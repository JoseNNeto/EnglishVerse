import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, type UserProfile } from '../contexts/AuthContext';

export default function RoleRoute({
  role,
  children,
}: {
  role: UserProfile;
  children: ReactNode;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (!user || user.perfil !== role) {
    return <Navigate to={user?.perfil === 'DOCENTE' ? '/teacher-studio' : '/'} replace />;
  }
  return children;
}
