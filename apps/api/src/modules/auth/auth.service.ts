import { Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { prisma, Role } from '@shop-ai/database';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(private jwtService: JwtService) {}

  async onModuleInit() {
    const email = process.env.ADMIN_EMAIL || 'test@gmail.com';
    const plainPassword = process.env.ADMIN_PASSWORD || 'Test1234';
    const name = process.env.ADMIN_NAME || 'Test Admin';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    try {
      await prisma.user.upsert({
        where: { email },
        update: {
          password: hashedPassword,
          role: Role.ADMIN,
          name,
        },
        create: {
          email,
          password: hashedPassword,
          name,
          role: Role.ADMIN,
        },
      });
    } catch (error) {
      console.error('Failed to auto-seed admin user:', error);
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
}
