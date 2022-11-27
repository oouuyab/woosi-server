import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../service/user.service';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { ulid } from 'ulid';
import * as bcrypt from 'bcrypt';
import { USER_STATUS, USER_TYPE } from '../../common/enum';
import { ERROR_MSG } from '../../common/error-msg';
import { BadRequestException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;

  const mockUserRepository = {
    save: jest.fn().mockImplementation((user) =>
      Promise.resolve({
        id: ulid(),
        userName: user.userName,
        email: user.email,
        pw: bcrypt.hashSync(user.pw, 10),
        hpNo: user.hpNo,
        userType: USER_TYPE.DEFAULT,
        userStatus: USER_STATUS.ACTIVE,
        regDate: new Date(),
        ...user,
      }),
    ),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('유저 생성 시 유저 이름, 타입, 상태만 리턴', async () => {
    const userInfo = {
      userName: faker.name.fullName(),
      email: faker.internet.email(),
      hpNo: faker.phone.number('010########'),
      pw: faker.internet.password(),
    };

    const result = await service.create(userInfo);

    expect(result).toEqual({
      email: result.email,
      userName: userInfo.userName,
      userType: USER_TYPE.DEFAULT,
      userStatus: USER_STATUS.ACTIVE,
    });
  });

  it('유저 생성 - email 중복 에러', async () => {
    const sameEmail = faker.internet.email();

    jest.spyOn(mockUserRepository, 'findOne').mockResolvedValueOnce({
      userName: faker.name.fullName(),
      email: sameEmail,
      hpNo: faker.phone.number('010########'),
      userStatus: USER_STATUS.ACTIVE,
      USER_TYPE: USER_TYPE.DEFAULT,
    });

    const sameEmailUserInfo = {
      userName: faker.name.fullName(),
      email: sameEmail,
      hpNo: faker.phone.number('010########'),
      pw: faker.internet.password(),
    };

    await expect(service.create(sameEmailUserInfo)).rejects.toThrowError(
      new BadRequestException(ERROR_MSG.ALREADY_EXIST_USER),
    );
  });

  it('유저 생성 - hpNo 중복 에러', async () => {
    const sameHpNo = faker.phone.number('010########');

    jest.spyOn(mockUserRepository, 'findOne').mockResolvedValueOnce({
      userName: faker.name.fullName(),
      email: faker.internet.email(),
      hpNo: sameHpNo,
      userStatus: USER_STATUS.ACTIVE,
      USER_TYPE: USER_TYPE.DEFAULT,
    });

    const sameEmailUserInfo = {
      userName: faker.name.fullName(),
      email: faker.internet.email(),
      hpNo: sameHpNo,
      pw: faker.internet.password(),
    };

    await expect(service.create(sameEmailUserInfo)).rejects.toThrowError(
      new BadRequestException(ERROR_MSG.ALREADY_EXIST_USER),
    );
  });

  it('email로 유저 찾기', async () => {
    const email = faker.internet.email();

    jest.spyOn(mockUserRepository, 'findOne').mockResolvedValueOnce({
      email,
      userName: faker.name.fullName(),
      hpNo: faker.phone.number('010########'),
      userStatus: USER_STATUS.ACTIVE,
      USER_TYPE: USER_TYPE.DEFAULT,
    });

    const result = await service.findOneByEmail({ email });

    expect(result).not.toBeUndefined();
    expect(result.email).toBe(email);
  });

  it('email로 유저 찾기 - 없는 유저', async () => {
    const email = faker.internet.email();

    jest.spyOn(mockUserRepository, 'findOne').mockResolvedValueOnce({});

    await expect(service.findOneByEmail({ email })).rejects.toThrowError(
      new BadRequestException(ERROR_MSG.NOT_FOUND_USER),
    );
  });

  it('hpNo로 유저 찾기', async () => {
    const hpNo = faker.phone.number('010########');
    const userName = faker.name.fullName();

    jest.spyOn(mockUserRepository, 'findOne').mockResolvedValueOnce({
      hpNo,
      userName,
      userStatus: USER_STATUS.ACTIVE,
      USER_TYPE: USER_TYPE.DEFAULT,
    });

    const result = await service.findOneByHpNo({ hpNo });

    expect(result).not.toBeUndefined();
    expect(result.userName).toBe(userName);
  });

  it('hpNo로 유저 찾기 - 없는 유저', async () => {
    const hpNo = faker.phone.number('010########');

    jest.spyOn(mockUserRepository, 'findOne').mockResolvedValueOnce({});

    await expect(service.findOneByHpNo({ hpNo })).rejects.toThrowError(
      new BadRequestException(ERROR_MSG.NOT_FOUND_USER),
    );
  });
});
