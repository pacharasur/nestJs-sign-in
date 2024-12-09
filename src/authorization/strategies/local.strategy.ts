import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthorizationService } from '../authorization.service';
import { UserDetailDto } from 'src/users/dto/user-data.dto';
import { decryptData } from 'src/util/tools';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthorizationService) {
    super({passReqToCallback: true});
  }

  async validate(req: any,username: string, password: string): Promise<UserDetailDto> {
    console.log(req.body);
    // const passwordRegex = /^(?=.*\d)(?=.*[\W_]).{8,}$/;
    // return passwordRegex.test(password);
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}