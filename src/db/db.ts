// src/db/db.ts
import sql, { ConnectionPool } from 'mssql';
import { env } from '../config/env';

// Usamos puerto fijo (1433). Nada de instancia.
const serverPart = `${env.sql.host},${env.sql.port}`;

const connectionString =
  `Server=${serverPart};Database=${env.sql.db};` +
  `User Id=${env.sql.user};Password=${env.sql.password};` +
  `Encrypt=false;TrustServerCertificate=true;`;

console.log('[DB] connecting to', serverPart, 'db:', env.sql.db, 'user:', env.sql.user);

let poolPromise: Promise<ConnectionPool> | null = null;

export function getPool(): Promise<ConnectionPool> {
  if (!poolPromise) {
    poolPromise = sql.connect(connectionString)
      .then((pool: ConnectionPool) => {
        console.log('[DB] connected');
        return pool;
      })
      .catch((err: Error) => {
        console.error('[DB] connection error:', err.message);
        poolPromise = null;
        throw err;
      });
  }
  return poolPromise;
}

export { sql };

