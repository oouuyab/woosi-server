import { SetMetadata } from '@nestjs/common';
import { ROLE } from '../common/enum';

export const Roles = (...roles: ROLE[]) => SetMetadata('roles', roles);
