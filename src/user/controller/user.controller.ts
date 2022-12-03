import { Controller, Post, Body, Get, Query, Redirect } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { CreateUserReqDto, CreateUserResDto } from '../dto/create-user.dto';
import {
  FindUserByEmailReqDto,
  FindUserByHpNoReqDto,
  FindUserResDto,
} from '../dto/find-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: '유저 생성 API', description: '유저를 생성한다.' })
  @ApiResponse({
    description: '유저를 생성한다.',
    status: 201,
  })
  async create(@Body() createUserDto: CreateUserReqDto): Promise<void> {
    await this.userService.create(createUserDto);

    Redirect('/login', 301);
  }

  @Get('/email')
  async findOneByEmail(@Query('email') email: string): Promise<FindUserResDto> {
    const reqDto = new FindUserByEmailReqDto(email);

    return await this.userService.findOneByEmail(reqDto);
  }

  @Get('hpNo')
  async findOneByHpNo(@Query('hpNo') hpNo: string): Promise<FindUserResDto> {
    const reqDto = new FindUserByHpNoReqDto(hpNo);

    return await this.userService.findOneByHpNo(reqDto);
  }
}
