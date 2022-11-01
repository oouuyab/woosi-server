import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ulid } from 'ulid';
import { CreateUserReqDto, CreateUserResDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { USER_STATUS, USER_TYPE } from '../common/enum';
import * as _ from 'lodash';
import { ERROR_MSG } from '../common/error-msg';
import {
  FindUserByEmailReqDto,
  FindUserByHpNoReqDto,
  FindUserResDto,
} from './dto/find-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  private async _findOneByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { email } });
  }

  private async _findOneByHpNo(hpNo: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { hpNo } });
  }

  private async _createUserValidator(
    createUserDto: CreateUserReqDto,
  ): Promise<void> {
    const userInfoByEmail = await this._findOneByEmail(createUserDto.email);
    const isExistUserByEmail = !_.isEmpty(userInfoByEmail);

    if (isExistUserByEmail) {
      if (userInfoByEmail.userStatus === USER_STATUS.ACTIVE) {
        throw new BadRequestException(ERROR_MSG.ALREADY_EXIST_USER);
      } else if (userInfoByEmail.userStatus === USER_STATUS.INACTIVE) {
        throw new BadRequestException(ERROR_MSG.INACTIVE_USER);
      } else if (userInfoByEmail.userStatus === USER_STATUS.LEAVE) {
        throw new BadRequestException(ERROR_MSG.LEAVE_USER);
      }
    }

    const userInfoByHpNo = await this._findOneByHpNo(createUserDto.hpNo);
    const isExistUserByHpNo = !_.isEmpty(userInfoByHpNo);

    if (isExistUserByHpNo) {
      if (userInfoByHpNo.userStatus === USER_STATUS.ACTIVE) {
        throw new BadRequestException(ERROR_MSG.ALREADY_EXIST_USER);
      } else if (userInfoByHpNo.userStatus === USER_STATUS.INACTIVE) {
        throw new BadRequestException(ERROR_MSG.INACTIVE_USER);
      } else if (userInfoByHpNo.userStatus === USER_STATUS.LEAVE) {
        throw new BadRequestException(ERROR_MSG.LEAVE_USER);
      }
    }
  }

  async create(req: CreateUserReqDto): Promise<CreateUserResDto> {
    await this._createUserValidator(req);

    const user = new UserEntity();

    user.id = ulid();
    user.userName = req.userName;
    user.email = req.email;
    user.pw = await bcrypt.hash(req.pw, 10);
    user.hpNo = req.hpNo;
    user.userType = USER_TYPE.DEFAULT;
    user.userStatus = USER_STATUS.ACTIVE;

    const createdUser = await this.userRepository.save(user);

    return new CreateUserResDto(createdUser);
  }

  async findOneByEmail(req: FindUserByEmailReqDto): Promise<FindUserResDto> {
    const result = await this._findOneByEmail(req.email);

    if (_.isEmpty(result)) {
      throw new BadRequestException(ERROR_MSG.NOT_FOUND_USER);
    }

    return {
      email: result.email,
      userName: result.userName,
      userStatus: result.userStatus,
      userType: result.userType,
    };
  }

  async findOneByHpNo(req: FindUserByHpNoReqDto): Promise<FindUserResDto> {
    const result = await this._findOneByHpNo(req.hpNo);

    if (_.isEmpty(result)) {
      throw new BadRequestException(ERROR_MSG.NOT_FOUND_USER);
    }

    return {
      email: result.email,
      userName: result.userName,
      userStatus: result.userStatus,
      userType: result.userType,
    };
  }
}
