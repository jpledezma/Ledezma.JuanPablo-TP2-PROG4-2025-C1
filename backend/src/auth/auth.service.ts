import { Injectable } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor() {}
  crearToken(id: any, username: string, acceso?: string) {
    const payload = {
      id: id,
      username: username,
      acceso: acceso || 'usuario',
      iat: Date.now() / 1000,
      exp: Date.now() / 1000 + 60 * 15,
    };

    const token = sign(payload, process.env.JWT_SECRET!);

    return token;
  }

  leerToken(token: string) {
    try {
      const decodificado = verify(token, process.env.JWT_SECRET!);
      return decodificado;
    } catch (error) {
      return null;
    }
  }
}
