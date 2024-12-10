import { ForbiddenException, Inject, Injectable, InternalServerErrorException, Logger, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, Tokens } from './types';
import { UsersRepository } from 'src/users/users.repository';
import { UserDetailDto, UserDto } from 'src/users/dto/user-data.dto';
import { ErrorMessage } from 'src/util/error-message';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthorizationService {

  constructor(
    @Inject(Logger)
    private readonly logger: LoggerService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersRepository: UsersRepository,
  ) { }

  async signIn(user: UserDto): Promise<Tokens> {
    try {
      const tokens = await this.getTokens(user);
      this.logger.log(`The user ${user.username} has been signin.`);
      return tokens;

    } catch (err) {
      this.logger.error(`Failed to signIn ${err}`);
      throw err;
    }
  }

  async validateUser(username: string, password: string): Promise<UserDetailDto> {
    try {
      const result = await this.usersRepository.getUserByUserName(username);
      if (!result) {
        throw new ForbiddenException(ErrorMessage.USER_NOT_FOUND);
      }

      await this.comparePassword(password, result.password);
      return { username, nickname: result.nickname } as UserDetailDto;

    } catch (err) {
      this.logger.error(`Failed to validate user ${err}`);
      throw err;
    }
  }

  async comparePassword(password, hash): Promise<boolean> {
    const passMatches = await bcrypt.compare(password, hash);
    if (!passMatches) {
      this.logger.error(`The password of user is not match.`);
      throw new ForbiddenException(ErrorMessage.INCORRECT_PASSWORD);
    }
    return passMatches;
  }

  async getTokens(userData: UserDto): Promise<Tokens> {
    try {
      const jwtPayload: JwtPayload = {
        username: userData.username,
        nickname: userData.nickname
      };

      const accessToken = await this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: '1h',
      })

      return {
        accessToken: accessToken
      };
    } catch (err) {
      this.logger.error(`Failed to get tokens ${err}`);
      throw new InternalServerErrorException(err);
    }
  }
}
