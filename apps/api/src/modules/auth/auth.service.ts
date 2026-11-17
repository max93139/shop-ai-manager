import { BadRequestException, Injectable, Logger, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { prisma, Role } from '@shop-ai/database';
import { LoginDto } from './dto/login.dto';
import type { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(private jwtService: JwtService) {}

  /**
   * Creates the first admin from ADMIN_EMAIL / ADMIN_PASSWORD when that account does not exist yet.
   * An existing account is never overwritten, so a password changed in the admin survives restarts.
   */
  async onModuleInit() {
    const email = process.env.ADMIN_EMAIL?.trim();
    const plainPassword = process.env.ADMIN_PASSWORD;
    if (!email || !plainPassword) {
      this.logger.warn('ADMIN_EMAIL or ADMIN_PASSWORD is not set; no admin account is seeded');
      return;
    }

    try {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) return;
      await prisma.user.create({
        data: {
          email,
          password: await bcrypt.hash(plainPassword, 10),
          name: process.env.ADMIN_NAME?.trim() || 'Admin',
          role: Role.ADMIN,
        },
      });
      this.logger.log(`Seeded admin account ${email}`);
    } catch (error) {
      this.logger.error(`Failed to seed the admin account: ${error}`);
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  /** Verifies the current password, stores the new hash and returns a fresh token; older tokens stop working. */
  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.password) {
      throw new UnauthorizedException('Account not found');
    }

    if (!(await bcrypt.compare(dto.currentPassword, user.password))) {
      throw new BadRequestException('Current password is incorrect');
    }
    if (await bcrypt.compare(dto.newPassword, user.password)) {
      throw new BadRequestException('New password must differ from the current one');
    }

    // Whole seconds, because JWT iat has second precision and the new token must stay valid.
    const changedAt = new Date(Math.floor(Date.now() / 1000) * 1000);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: await bcrypt.hash(dto.newPassword, 10), passwordChangedAt: changedAt },
    });

    const access_token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });
    return { access_token };
  }
}
