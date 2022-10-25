import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { faker } from '@faker-js/faker';
import { ulid } from 'ulid';
import { USER_STATUS, USER_TYPE } from '../../common/enum';

describe('UserController', () => {
  let controller: UserController;

  const mockUserService = {
    create: jest.fn((dto) => {
      return {
        email: dto.email,
        userName: dto.userName,
        userType: USER_TYPE.DEFAULT,
        userStatus: USER_TYPE.HOST,
      };
    }),
    findOneByEmail: jest.fn(),
    findOneByHpNo: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('create user', async () => {
    const req = {
      email: faker.internet.email(),
      pw: faker.internet.password(),
      userName: faker.name.fullName(),
      hpNo: faker.phone.number('010########'),
    };

    const result = await controller.create(req);

    expect(result).not.toBeUndefined();
    expect(result.email).toBe(req.email);
    expect(result.userName).toBe(req.userName);
    expect(result.userType).toBe(USER_TYPE.DEFAULT);
    expect(result.userStatus).toBe(USER_STATUS.ACTIVE);
  });

  it('find user - email', async () => {
    const email = faker.internet.email();

    jest
      .spyOn(mockUserService, 'findOneByEmail')
      .mockImplementationOnce((req) => {
        if (req.email === email) {
          return {
            email,
            userName: faker.name.fullName(),
            hpNo: faker.phone.number('010########'),
            userType: USER_TYPE.DEFAULT,
            userStatus: USER_STATUS.ACTIVE,
          };
        }
      });

    const result = await controller.findOneByEmail(email);

    expect(result).not.toBeUndefined();
    expect(result.email).toEqual(email);
    expect(result.userName).toEqual(expect.any(String));
    expect(result.userType).toEqual(USER_TYPE.DEFAULT);
    expect(result.userStatus).toEqual(USER_STATUS.ACTIVE);
  });

  it('find user - hpNo', async () => {
    const hpNo = faker.phone.number('010########');

    jest
      .spyOn(mockUserService, 'findOneByHpNo')
      .mockImplementationOnce((req) => {
        if (req.hpNo === hpNo) {
          return {
            hpNo,
            email: faker.internet.email(),
            userName: faker.name.fullName(),
            userType: USER_TYPE.DEFAULT,
            userStatus: USER_STATUS.ACTIVE,
          };
        }
      });

    const result = await controller.findOneByHpNo(hpNo);

    expect(result).not.toBeUndefined();
    expect(result.email).toEqual(expect.any(String));
    expect(result.userName).toEqual(expect.any(String));
    expect(result.userType).toEqual(USER_TYPE.DEFAULT);
    expect(result.userStatus).toEqual(USER_STATUS.ACTIVE);
  });
});
