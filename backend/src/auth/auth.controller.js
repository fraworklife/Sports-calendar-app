import {
  Controller,
  Post,
  Get,
  Body,
  Inject,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  /**
   * @param {AuthService} authService
   */
  constructor(@Inject(AuthService) authService) {
    this.authService = authService;
  }

  @Post('register')
  /**
   * @param {import('./dto/auth.dto').RegisterDto} dto
   */
  register(@Body() dto) {
    return this.authService.register(dto);
  }

  @Post('login')
  /**
   * @param {import('./dto/auth.dto').LoginDto} dto
   */
  login(@Body() dto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    return this.authService.getProfile(req.user.id);
  }
}
