import * as path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.join(process.cwd(), '.env') });

function required(name: string, fallback?: string) {
  const v = process.env[name] ?? fallback;
  if (v === undefined || v === '') throw new Error(`Environment variable ${name} is required`);
  return v;
}

export const env = {
  port: Number(process.env.PORT ?? 3000),
  sql: {
    host: required('SQLSERVER_HOST'),
    // ya NO usamos instancia porque vamos por puerto 1433
    port: Number(required('SQLSERVER_PORT')), // número
    db: required('SQLSERVER_DB'),
    user: required('SQLSERVER_USER'),
    password: required('SQLSERVER_PASSWORD'), // nombre unificado
  },
  jwt: {
    secret: required('JWT_SECRET'),
    expiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
  },
};

// Log diagnóstico (sin password)
console.log('[ENV]', {
  host: env.sql.host,
  port: env.sql.port,
  db: env.sql.db,
  user: env.sql.user,
});

