export type Rol = 'tecnico' | 'coordinador';

export type User = {
  id: number;
  username: string;
  rol: Rol;
};

export type LoginBody = {
  username: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: User;
};
