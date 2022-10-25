import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { USER_STATUS, USER_TYPE } from '../../common/enum';

export class CreateUserReqDto {
  @ApiProperty({
    example: '우시',
    description: '유저 이름',
    required: true,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  userName: string;

  @ApiProperty({
    example: 'woosi@woosi.io',
    description: '이메일',
    required: true,
  })
  @IsString()
  @IsEmail()
  @MaxLength(50)
  email: string;

  @ApiProperty({
    example: 'password',
    description: '패스워드',
    required: true,
  })
  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
  pw: string;

  @ApiProperty({
    example: '01000000000',
    description: '휴대전화번호',
    required: true,
  })
  @IsString()
  @Length(11, 11)
  hpNo: string;

  constructor(param: any) {
    this.userName = param.userName;
    this.email = param.email;
    this.pw = param.pw;
    this.hpNo = param.hpNo;
  }
}

export class CreateUserResDto {
  @ApiProperty({
    example: 'woosi@woosi.io',
    description: '이메일',
    required: true,
  })
  @IsString()
  @IsEmail()
  @MaxLength(50)
  email: string;

  @ApiProperty({
    example: '우시',
    description: '유저 이름',
    required: true,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  userName: string;

  @ApiProperty({
    example: USER_TYPE.DEFAULT,
    description: '유저 타입 (0: DEFAULT, 1: HOST)',
    required: true,
  })
  @IsEnum(USER_TYPE)
  userType: USER_TYPE;

  @ApiProperty({
    example: USER_STATUS.ACTIVE,
    description: '유저 상태 (1: ACTIVE, 2: INACTIVE, 3: LEAVE)',
    required: true,
  })
  @IsEnum(USER_STATUS)
  userStatus: USER_STATUS;

  constructor(param: any) {
    this.userName = param.userName;
    this.email = param.email;
    this.userType = param.userType;
    this.userStatus = param.userStatus;
  }
}
