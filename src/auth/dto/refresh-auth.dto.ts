import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsString } from 'class-validator';

export class RefreshAuthResDto {
  @ApiProperty({
    example: 'access_token',
    description: 'access_token',
    required: true,
  })
  @IsString()
  @IsJWT()
  'access_token': string;

  @ApiProperty({
    example: 'refresh_token',
    description: 'refresh_token',
    required: true,
  })
  @IsString()
  @IsJWT()
  'refresh_token': string;
}

export class RefreshAuthReqDto {
  @ApiProperty({
    example: 'refresh_token',
    description: 'refresh_token',
    required: true,
  })
  @IsString()
  @IsJWT()
  'refresh_token': string;
}
