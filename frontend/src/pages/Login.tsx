import { useState } from 'react';
import { useAuth } from '../auth/useAuth';

export default function Login() {
  const { login } = useAuth();
  const [username, setU] = useState('tecnico1');
  const [password, setP] = useState('123456');
  const [loading, setL] = useState(false);
  const [error, setE] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setE(null); setL(true);
    try { await login(username, password); }
    catch (err: any) { setE(err?.message || 'Credenciales inválidas'); }
    finally { setL(false); }
  }

  return (
    <div className="page">
      <form onSubmit={onSubmit} className="card" autoComplete="on">
        <h1 style={{margin: 0, fontSize: 44, color: '#0b1220'}}>Login</h1>
        <p className="helper">Ingresa tus credenciales para continuar.</p>

        <label className="label">
          Usuario
          <input className="input" value={username} onChange={e=>setU(e.target.value)} autoComplete="username" />
        </label>

        <label className="label">
          Contraseña
          <input className="input" type="password" value={password} onChange={e=>setP(e.target.value)} autoComplete="current-password" />
        </label>

        {error && <div className="error">{error}</div>}

        <button className="btn" disabled={loading} style={{width:'100%', height:46, marginTop:16}}>
          {loading ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
}
