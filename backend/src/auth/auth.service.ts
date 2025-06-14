import { Injectable } from '@nestjs/common';
import { Usuario } from '../usuario/entities/usuario.entity';

@Injectable()
export class AuthService {
  constructor() {}
  crearToken(id: any, username: string) {
    return 'token bien piola';
  }
}
