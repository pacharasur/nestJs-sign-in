import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthorizationService } from '../authorization.service';
import { UserDetailDto } from 'src/users/dto/user-data.dto';
import { passwordRegex } from 'src/util/tools';
import { EncryptService } from 'src/encrypt/encrypt.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthorizationService,
    private readonly encryptService: EncryptService,
  ) {
    super({ passReqToCallback: true });
  }

  async validate(req: any, username: string): Promise<UserDetailDto> {
    const passwordDecrypt = this.encryptService.decryptData(req.body.password, req.body.iv, req.body.authTag);
    const validPass = passwordRegex(passwordDecrypt);
    if (!validPass) {
      throw new BadRequestException('password อย่างน้อย 8 ตัวอักษร มีตัวเลขอย่างน้อย 1 ตัว ตัวอักขระพิเศษอย่างน้อย 1 ตัว')
    }
    const user = await this.authService.validateUser(username, passwordDecrypt);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}