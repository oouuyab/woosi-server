import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../service/auth.service';
import { LoginAuthResDto } from '../dto/login-auth.dto';
import { LocalAuthGuard } from '../guard/local-auth.guard';
import { JwtRefreshAuthGuard } from '../guard/jwt-refresh-auth.guard';
import { RefreshAuthResDto } from '../dto/refresh-auth.dto';

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

  @ApiTags('Auth')
  @ApiOperation({
    summary: 'access_token 발행',
    description: 'refresh_token으로 access_token 발행',
  })
  @ApiResponse({
    description: 'access_token 발행',
    status: 201,
    type: RefreshAuthResDto,
  })
  @ApiTags('Auth')
  @UseGuards(JwtRefreshAuthGuard)
  @Get('refresh')
  async getAccessToken(@Request() req): Promise<RefreshAuthResDto> {
    return await this.authService.getAccessToken(req.user);
  }
}
