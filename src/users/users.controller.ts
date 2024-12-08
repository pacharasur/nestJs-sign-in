import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { IUserResponse } from './interfaces/user.interface';
import { UserDetailDto, UserDto } from './dto/user-data.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ParseFile } from 'src/util/parse-file.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Public() //ลบด้วย
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() user: UserDto): Promise<IUserResponse> {
    return await this.usersService.createUser(user);
  }

  @Public() //ลบด้วย
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getUserById(@Param('id') id: number): Promise<IUserResponse> {
    return await this.usersService.getUserById(id);
  }

  @Public()
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: number,
    @Body() body: UserDetailDto,
  ): Promise<any> {
    return await this.usersService.findOneAndUpdate(id, body);
  }


  @Public() //ลบด้วย
  @Post('compare-images')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FilesInterceptor('images', 2))
  async compareImages(
    @UploadedFiles(ParseFile) images: Express.Multer.File[],
  ) {
    // this.logger.log('Uploading file...');
    return await this.usersService.compareImages(
      images,
    );
  }
}
