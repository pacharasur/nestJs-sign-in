import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthorizationService } from '../authorization.service';
import { UserDetailDto, UserDto } from 'src/users/dto/user-data.dto';
import { EncryptService } from 'src/encrypt/encrypt.service';
import { validateOrReject } from 'class-validator';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthorizationService,
    private readonly encryptService: EncryptService,
  ) {
    super({ passReqToCallback: true });
  }

  async validate(req: any, username: string): Promise<UserDetailDto> {
    const passwordDecrypt = this.encryptService.decryptData(req.body.password, req.body.iv, req.body.authTag);
    await this.validateFields(username, passwordDecrypt);
    const user = await this.authService.validateUser(username, passwordDecrypt);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async validateFields(username: string, password: string) {
    try {
      const userDto = new UserDto();
      userDto.username = username;
      userDto.password = password;
      await validateOrReject(userDto);
    } catch (err) {
      if (err instanceof Array) {
        const errorMessages = err.map((error) => Object.values(error.constraints)).join(', ');
        throw new BadRequestException(`${errorMessages}`);
      }
    }
  }

}