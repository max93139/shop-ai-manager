import { Injectable, UnauthorizedException } from '@nestjs/common';
import { prisma } from '@shop-ai/database';
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

  /** Rejects tokens of deleted users and tokens issued before the last password change. */
  async validate(payload: { sub: string; email: string; role?: string; name?: string; iat?: number }) {
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, role: true, name: true, passwordChangedAt: true },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    if (user.passwordChangedAt && (payload.iat ?? 0) * 1000 < user.passwordChangedAt.getTime()) {
      throw new UnauthorizedException('Session expired after a password change');
    }
    return { id: user.id, email: user.email ?? payload.email, role: user.role, name: user.name };
  }
}
