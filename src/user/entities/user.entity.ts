import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { USER_STATUS, USER_TYPE } from '../../common/enum';

@Entity('tb_user')
export class UserEntity {
  @PrimaryColumn({ name: 'id', nullable: false })
  id: string;

  @Column({ name: 'email', length: 500, nullable: false })
  email: string;

  @Column({ name: 'pw', length: 500, nullable: false })
  pw: string;

  @Column({ name: 'user_name', length: 50, nullable: false })
  userName: string;

  @Column({ name: 'hp_no', length: 11, nullable: false })
  hpNo: string;

  @Column({ name: 'user_type', type: 'enum', enum: USER_TYPE, nullable: false })
  userType: USER_TYPE;

  @Column({
    name: 'user_status',
    type: 'enum',
    enum: USER_STATUS,
    nullable: false,
  })
  userStatus: USER_STATUS;

  @UpdateDateColumn({ name: 'update_date', nullable: false })
  updateDate: Date;

  @CreateDateColumn({ name: 'reg_date', nullable: false })
  regDate: Date;
}
