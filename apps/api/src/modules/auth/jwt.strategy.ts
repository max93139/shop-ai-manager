import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';

function extractToken(req: Request): string | null {
  const fromCookie = (req as any)?.cookies?.access_token;
  const fromHeader = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
  return fromCookie || fromHeader || null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: extractToken,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  validate(payload: { sub: string; email: string; role?: string; name?: string }) {
    return { id: payload.sub, email: payload.email, role: payload.role, name: payload.name };
  }
}
