// src/oauth/jwt-auth.guard.ts
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): any {
    const req = context.switchToHttp().getRequest();
    return super.canActivate(context);

  }
  handleRequest(err, user, info) {

    if (err || !user) {

      console.error('Auth Failure Error:', err)
      console.log('Auth Failure Info:', info)
      throw err || new UnauthorizedException('Invalid or missing token');
    }
    return user;
  }
}
