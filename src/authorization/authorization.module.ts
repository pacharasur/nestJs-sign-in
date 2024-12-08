import { forwardRef, Logger, Module } from '@nestjs/common';
import { AuthorizationController } from './authorization.controller';
import { AuthorizationService } from './authorization.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { AccessTokenstrategy, LocalStrategy } from './strategies';

@Module({
  imports: [
    PassportModule, JwtModule.register({}),
    forwardRef(() => UsersModule),
  ],
  controllers: [AuthorizationController],
  providers: [AuthorizationService, Logger, LocalStrategy, AccessTokenstrategy]
})
export class AuthorizationModule { }
