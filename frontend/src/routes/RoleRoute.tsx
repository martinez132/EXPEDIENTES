import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
export default function RoleRoute({ role, children }: { role: 'coordinador'; children: JSX.Element }) {
  const { user } = useAuth();
  return user?.rol === role ? children : <Navigate to="/" replace />;
}
