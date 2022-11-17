import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ERROR_MSG } from '../../common/error-msg';
import { UserEntity } from '../../user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { USER_STATUS } from '../../common/enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  private async _findOneByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { email } });
  }

  private async _findOneById(id: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { id } });
  }

  private _validateUserStatus(userStatus: USER_STATUS): boolean {
    switch (userStatus) {
      case USER_STATUS.INACTIVE:
        throw new UnauthorizedException(ERROR_MSG.INACTIVE_USER);
      case USER_STATUS.LEAVE:
        throw new UnauthorizedException(ERROR_MSG.LEAVE_USER);
      default:
        return true;
    }
  }

  private async _validatePw(reqPw, pw): Promise<boolean> {
    const passwordChecker = await bcrypt.compare(reqPw, pw);
    if (!passwordChecker) {
      throw new UnauthorizedException(ERROR_MSG.NOT_MATCHED_EMAIL_PASSWORD);
    }
    return true;
  }

  async validateUserById(id: string): Promise<Omit<UserEntity, 'pw'>> {
    const user = await this._findOneById(id);
    if (!user) {
      throw new UnauthorizedException(ERROR_MSG.NOT_FOUND_USER);
    }

    this._validateUserStatus(user.userStatus);

    const { pw, ...result } = user;
    return result;
  }

  async validateUserByEmailAndPw(
    email: string,
    reqPw: string,
  ): Promise<Omit<UserEntity, 'pw'>> {
    const user = await this._findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException(ERROR_MSG.NOT_FOUND_USER);
    }

    this._validateUserStatus(user.userStatus);
    await this._validatePw(reqPw, user.pw);

    const { pw, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = {
      id: user.id,
      userType: user.userType,
      userStatus: user.userStatus,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
