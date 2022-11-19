import { Controller, Post, Body, Get, Query } from '@nestjs/common';
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
    type: CreateUserResDto,
  })
  async create(
    @Body() createUserDto: CreateUserReqDto,
  ): Promise<CreateUserResDto> {
    return await this.userService.create(createUserDto);
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
