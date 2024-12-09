import { Logger, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { usersEntity } from './entities/users.entity';
import { UsersRepository } from './users.repository';
import { EncryptService } from 'src/encrypt/encrypt.service';

@Module({
  controllers: [UsersController],
  imports: [
    TypeOrmModule.forFeature([
      usersEntity,
    ]),
  ],
  providers: [UsersService, UsersRepository, EncryptService],
  exports: [UsersRepository, UsersService,],
})
export class UsersModule { }
