import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../service/auth.service';
import { LoginAuthResDto } from '../dto/login-auth.dto';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { LocalAuthGuard } from '../guard/local-auth.guard';

@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiTags('Auth')
  @ApiOperation({
    summary: 'email 로그인',
    description: 'email로 로그인을 한다.',
  })
  @ApiResponse({
    description: 'email로 로그인을 한다.',
    status: 201,
    type: LoginAuthResDto,
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req): Promise<LoginAuthResDto> {
    return await this.authService.login(req.user);
  }
}
