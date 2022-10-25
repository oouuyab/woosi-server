import { IsEmail, IsString, Length, MaxLength } from 'class-validator';
import { USER_STATUS, USER_TYPE } from '../../common/enum';

export class FindUserByEmailReqDto {
  @IsString()
  @IsEmail()
  @MaxLength(50)
  email: string;

  constructor(email: string) {
    this.email = email;
  }
}

export class FindUserByHpNoReqDto {
  @IsString()
  @Length(11, 11)
  hpNo: string;

  constructor(hpNo: string) {
    this.hpNo = hpNo;
  }
}

export interface FindUserResDto {
  email: string;
  userName: string;
  userType: USER_TYPE;
  userStatus: USER_STATUS;
}
