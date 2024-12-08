import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { usersEntity } from './entities/users.entity';
import { UsersRepository } from './users.repository';

@Module({
  controllers: [UsersController],
  imports: [
    TypeOrmModule.forFeature([
      usersEntity,
    ]),
  ],
  providers: [UsersService, UsersRepository,],
  exports: [UsersRepository, UsersService],
})
export class UsersModule { }
