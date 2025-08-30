import { Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

export default function Navbar() {
  const { token, user, logout } = useAuth();

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link to="/" className="brand">Expedientes</Link>

        <div className="links">
          <Link to="/" className="a">Inicio</Link>
          {token && <Link to="/expedientes" className="a">Expedientes</Link>}
          {user?.rol === 'coordinador' && <Link to="/revisar" className="a">Revisar</Link>}
        </div>

        <div>
          {!token
            ? <Link to="/login" className="btn">Login</Link>
            : <button onClick={logout} className="btn">Salir</button>}
        </div>
      </div>
    </nav>
  );
}
