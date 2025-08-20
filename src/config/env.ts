import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT ?? 3000),
  sql: {
    server: process.env.SQLSERVER_HOST!,
    port: Number(process.env.SQLSERVER_PORT ?? 1433),
    database: process.env.SQLSERVER_DB!,
    user: process.env.SQLSERVER_USER!,
    password: process.env.SQLSERVER_PASSWORD!,
  },
  jwt: {
    secret: process.env.JWT_SECRET!,
    expiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
  }
};
