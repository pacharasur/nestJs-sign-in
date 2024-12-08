import { ForbiddenException, HttpException, HttpStatus, Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, Tokens } from './types';
import { UsersRepository } from 'src/users/users.repository';
import { UserDto } from 'src/users/dto/user-data.dto';
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
      const data = {
        username: 'zzz'
      } as any;

      const tokens = await this.getTokens(data);
      this.logger.log(`The user ${data.username} has been signin.`);
      return tokens;

    } catch (err) {
      this.logger.error('cannot get head-quarter contracts');
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async validateUser(username: string, password: string): Promise<any> {
    try {
      const result = await this.usersRepository.findByUserName(username);
      if (!result) {
        this.logger.error(`The user ${username} is not found.`);
        throw new ForbiddenException(ErrorMessage.USER_NOT_FOUND);
      }

      const passMatches = await bcrypt.compare(password, result.password);
      console.log('passMatches', passMatches);
      if (!passMatches) {
        this.logger.error(`The password of user ${username} is not match.`);
        throw new ForbiddenException(ErrorMessage.INCORRECT_PASSWORD);
      }
      return username;
      //มาจัดการด้วยถ้ามันไม่ math
    } catch (err) {
      this.logger.error(err);
      throw new HttpException(err, HttpStatus.FORBIDDEN);
    }
  }

  async getTokens(userData: any) {
    const jwtPayload: JwtPayload = {
      username: 'zzz'
    };

    const accessToken = await this.jwtService.signAsync(jwtPayload, {
      secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: '1h',
    })

    return {
      accessToken: accessToken
    };
  }
}
