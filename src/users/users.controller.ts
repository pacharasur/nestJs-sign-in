import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { IComparisonResponse, IUserResponse } from './interfaces/user.interface';
import { UserDetailDto, UserDto } from './dto/user-data.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ParseFile } from 'src/util/parse-file.pipe';
import { IEncrypt } from './interfaces/encrypt.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  @UseInterceptors(FilesInterceptor('image', 1))
  async register(@UploadedFiles(ParseFile) image: Express.Multer.File, @Body() user: UserDto): Promise<IUserResponse> {
    return await this.usersService.createUser(user, image);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getUserById(@Param('id') id: number): Promise<IUserResponse> {
    return await this.usersService.getUserById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: number,
    @Body() body: UserDetailDto,
  ): Promise<IUserResponse> {
    return await this.usersService.findOneAndUpdate(id, body);
  }

  @Public()
  @Post('encrypt')
  @HttpCode(HttpStatus.OK)
  async encrypt(
    @Body() body: { password: string },
  ): Promise<IEncrypt> {
    return await this.usersService.encrypt(body.password);
  }

  @Public()
  @Post('decrypt')
  @HttpCode(HttpStatus.OK)
  async decrypt(
    @Body() body: { encryptedData: string, iv: string, authTag: string }
  ): Promise<string> {
    return await this.usersService.decrypt(body.encryptedData, body.iv, body.authTag);
  }

  @Post('compare-images')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FilesInterceptor('images', 2))
  async compareImages(
    @UploadedFiles(ParseFile) images: Express.Multer.File[],
  ): Promise<IComparisonResponse> {
    return await this.usersService.compareImages(
      images,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async deleteUserById(@Param('id') id: number) {
    return await this.usersService.deleteUserById(id);
  }
}
