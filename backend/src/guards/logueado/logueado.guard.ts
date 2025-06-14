import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class LogueadoGuard implements CanActivate {
  constructor(private authService: AuthService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const auth = request.header('Authorization');

    if (!auth) {
      return false;
    }

    const token = auth.split(' ')[1];
    const decodificado = this.authService.leerToken(token);

    return decodificado !== null;
  }
}
