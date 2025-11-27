import { Role } from '../schema';

export type TokenInfo = {
  id: number;
  role: Role;
};

export enum Cookie {
  ACCESS_TOKEN = 'accessToken',
  REFRESH_TOKEN = 'refreshToken'
}

export type Login = {
  username: string;
  password: string;
};

export type Signup = {
  username: string;
  password: string;
  role: Role;
};
