import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(
    user: User,
  ): Promise<{ access_token: string; bind_token: string }> {
    const payload = { username: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    const bindToken = this.jwtService.sign(payload, { expiresIn: '1d' }); // Токен для привязки
    return {
      access_token: accessToken,
      bind_token: bindToken,
    };
  }

  async register(registerDto: RegisterDto): Promise<User> {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new UnauthorizedException('Email already in use');
    }
    return this.usersService.create(registerDto.email, registerDto.password);
  }
}
