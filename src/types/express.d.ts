import 'express-serve-static-core';
declare module 'express-serve-static-core' {
  interface Request { user?: { id: number; username: string; rol: 'tecnico'|'coordinador' } }
}
