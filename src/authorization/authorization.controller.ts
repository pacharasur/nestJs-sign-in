import { Body, Controller, HttpCode, HttpStatus, Inject, Logger, LoggerService, Post, UseGuards } from '@nestjs/common';
import { Tokens } from './types';
import { UserDto } from 'src/users/dto/user-data.dto';
import { AuthorizationService } from './authorization.service';
import { LocalAuthGuard } from './guards/local.guard';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthorizationController {
  constructor(
    @Inject(Logger)
    private readonly logger: LoggerService,
    private authService: AuthorizationService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signInPin(@Body() user: UserDto): Promise<Tokens> {
    this.logger.log('Incoming request signin');
    return this.authService.signIn(user);
  }
}
