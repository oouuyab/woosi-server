import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsJWT,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ERROR_MSG } from '../../common/error-msg';

export class LoginAuthReqDto {
  @ApiProperty({
    example: 'test@.test.com',
    description: '이메일',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(50)
  email: string;

  @ApiProperty({
    example: 'password',
    description: '비밀번호',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: ERROR_MSG.NOT_MATCHED_EMAIL_PASSWORD })
  @MaxLength(30, { message: ERROR_MSG.NOT_MATCHED_EMAIL_PASSWORD })
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
  pw: string;
}

export class LoginAuthResDto {
  @ApiProperty({
    example: 'access_token',
    description: 'access_token',
    required: true,
  })
  @IsString()
  @IsJWT()
  'access_token': string;
}
