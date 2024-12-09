import { ForbiddenException, HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { usersEntity } from './entities/users.entity';
import * as bcrypt from 'bcryptjs';
import { UserDetailDto, UserDto } from './dto/user-data.dto';
import { status } from 'src/util/enums';
import { ErrorMessage } from 'src/util/error-message';
import { convertImageToBase64, populateToUserEntity, populateToUserResponse } from 'src/util/tools';
import { IComparisonResponse, IUserResponse } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    private readonly usersRepository: UsersRepository,
  ) { }

  async createUser(user: UserDto, image: Express.Multer.File): Promise<IUserResponse> {
    try {
      const hashedPassword = await this.hashPassword(user.password);
      const imageBase64 = convertImageToBase64(image[0].buffer);
      const userEntity = populateToUserEntity(user, hashedPassword, imageBase64);
      const result = await this.usersRepository.create(userEntity);
      return populateToUserResponse(result);
    } catch (err) {
      this.logger.error(`cannot create user ${err}`);
      throw err;
    }
  }


  async getUserById(id: number): Promise<IUserResponse> {
    try {

      const user = await this.usersRepository.getUserById(id);
      if (!user) throw new NotFoundException(ErrorMessage.USER_NOT_FOUND);
      return populateToUserResponse(user);

    } catch (err) {
      this.logger.error('cannot get user by ID');
      throw err;
    }
  }

  async findOneAndUpdate(id: number, dataUpdate: UserDetailDto) {
    try {
      const user = await this.usersRepository.getUserById(id);
      if (!user) throw new NotFoundException(ErrorMessage.USER_NOT_FOUND);
      await this.usersRepository.update(id, dataUpdate)
    } catch (err) {
      this.logger.error('cannot update user');
      throw err;
    }
  }

  async compareImages(images: Express.Multer.File[]): Promise<IComparisonResponse> {
    try {
      for (let i = 0; i < images.length; i++) {
        this.logger.log(images[i].originalname);
      }
      return {
        comparison: "The images are similar",
        message: "Images compared successfully",
      };
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

}
