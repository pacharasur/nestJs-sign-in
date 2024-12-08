import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { IUser } from './interfaces/user.interface';
import { UserDto } from './dto/user-data.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ParseFile } from 'src/util/parse-file.pipe';

@Controller('')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Public() //ลบด้วย
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() user: UserDto): Promise<IUser> {
    return await this.usersService.createUser(user);
  }

  @Public()
  @Post('compare-images')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FilesInterceptor('images', 2))
  async createDocuments(
    @UploadedFiles(ParseFile) images: Express.Multer.File[],
  ) {
    // this.logger.log('Uploading file...');
    return await this.usersService.compareImages(
      images,
    );
  }
}
