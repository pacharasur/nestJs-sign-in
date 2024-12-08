import { ForbiddenException, HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { usersEntity } from './entities/users.entity';
import * as bcrypt from 'bcryptjs';
import { UserDto } from './dto/user-data.dto';
import { status } from 'src/util/enums';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    private readonly usersRepository: UsersRepository,
  ) { }

  async createUser(user: UserDto): Promise<any> {
    try {
      const hashedPassword = await this.hashPassword(user.password);

      const userObj = Object.assign({
        user_name: user.username,
        password: hashedPassword,
        status: status.ACTIVE,
        created_at: new Date(),
        updated_at: new Date(),
      }) as usersEntity;

      const result = await this.usersRepository.create(userObj);
      return result;

    } catch (err) {
      this.logger.error('cannot create user');
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async compareImages(images: Express.Multer.File[]): Promise<any> {
    try {
      for (let i = 0; i < images.length; i++) {
        this.logger.log(images[i].originalname);
      }
      return {
        "comparison": "The images are similar",
        "image1": "/uploads/image1.png",
        "image2": "/uploads/image1.png"
      };
    } catch (err) {
      this.logger.error(err);
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

}
