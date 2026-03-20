import {
  Injectable,
  Inject,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  /**
   * @param {PrismaService} prisma
   * @param {JwtService} jwtService
   */
  constructor(@Inject(PrismaService) prisma, @Inject(JwtService) jwtService) {
    this.prisma = prisma;
    this.jwtService = jwtService;
  }

  /**
   * @param {import('./dto/auth.dto').RegisterDto} dto
   */
  async register(dto) {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (exists) {
      throw new ConflictException('Email già registrata');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
      },
    });

    const token = this.generateToken(user.id, user.email, user.name);
    return { user: { id: user.id, email: user.email, name: user.name }, token };
  }

  /**
   * @param {import('./dto/auth.dto').LoginDto} dto
   */
  async login(dto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Credenziali non valide');
    }

    const token = this.generateToken(user.id, user.email, user.name);
    return { user: { id: user.id, email: user.email, name: user.name }, token };
  }

  async getProfile(userId) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, createdAt: true },
    });
    return user;
  }

  generateToken(sub, email, name) {
    return this.jwtService.sign({ sub, email, name });
  }
}
