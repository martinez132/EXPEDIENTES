// src/app.ts
import express from 'express';
import cors from 'cors';
import routes from './routes';
import { setupSwagger } from './swagger';

const app = express();


app.use(
  cors({
    origin: ['http://localhost:5173'], 
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false, 
  })
);

app.use(express.json());

// Swagger UI
setupSwagger(app);

// Rutas de la API
app.use('/api', routes);

// Ping de prueba
app.get('/', (_req, res) => res.send('🚀 API funcionando'));

app.get('/health/db', async (_req, res) => {
  try {
    const { getPool } = await import('./db/db');
    const pool = await getPool();
    const r = await pool.request().query('SELECT DB_NAME() AS db;');
    res.json({
      ok: true,
      db: r.recordset[0].db,
      env: {
        host: process.env.SQLSERVER_HOST,
        instance: process.env.SQLSERVER_INSTANCE,
        port: process.env.SQLSERVER_PORT,
      },
    });
  } catch (e: any) {
    res.status(500).json({
      ok: false,
      error: e.message,
      env: {
        host: process.env.SQLSERVER_HOST,
        instance: process.env.SQLSERVER_INSTANCE,
        port: process.env.SQLSERVER_PORT,
      },
    });
  }
});

export default app;

