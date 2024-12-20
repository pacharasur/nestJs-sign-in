import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class usersEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 50 })
  user_name: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 50 })
  nickname: string;

  @Column({ type: 'varchar', length: 500 })
  avatar: string;

  @Column({ type: 'varchar', length: 10 })
  status: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'NOW()' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'NOW()' })
  updated_at: Date;
}

