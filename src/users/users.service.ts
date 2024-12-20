import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';
import { UserDetailDto, UserDto } from './dto/user-data.dto';
import { ErrorMessage } from 'src/util/error-message';
import { convertImageToBase64, encryptData, passwordRegex, populateToUserEntity, populateToUserResponse } from 'src/util/tools';
import { IComparisonResponse, IUserResponse } from './interfaces/user.interface';
import * as sharp from 'sharp';
import * as pixelmatch from 'pixelmatch';
import * as crypto from 'crypto';
import { IEncrypt } from './interfaces/encrypt.interface';
import { EncryptService } from 'src/encrypt/encrypt.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly encryptService: EncryptService,
  ) { }

  async createUser(user: UserDto, image: Express.Multer.File): Promise<IUserResponse> {
    try {
      const validPass = passwordRegex(user.password);
      if (!validPass) {
        throw new BadRequestException('password อย่างน้อย 8 ตัวอักษร มีตัวเลขอย่างน้อย 1 ตัว ตัวอักขระพิเศษอย่างน้อย 1 ตัว')
      }
      const hashedPassword = await this.hashPassword(user.password);

      const matchUser = await this.usersRepository.getUserByUserName(user.username);
      if (matchUser) throw new ConflictException(ErrorMessage.USER_EXISTS);

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

  async findOneAndUpdate(id: number, dataUpdate: UserDetailDto): Promise<IUserResponse> {
    try {
      const user = await this.usersRepository.getUserById(id);
      if (!user) throw new NotFoundException(ErrorMessage.USER_NOT_FOUND);
      const userUpdated = await this.usersRepository.update(id, dataUpdate);
      return populateToUserResponse(userUpdated);
    } catch (err) {
      this.logger.error('cannot update user');
      throw err;
    }
  }

  async deleteUserById(id: number): Promise<void> {
    this.logger.log(`delete User Id ${id}`);
    await this.usersRepository.deleteUserById(id);
  }

  async compareImages(images: Express.Multer.File[]): Promise<IComparisonResponse> {
    try {
      if (images.length !== 2) {
        throw new BadRequestException('ต้องการสองรูปภาพเพื่อใช้ในการเปรียบเทียบ');
      }
      const [image1, image2] = images;
      const imageBuffer1 = await sharp(image1.buffer).resize(800, 600).raw().toBuffer();
      const imageBuffer2 = await sharp(image2.buffer).resize(800, 600).raw().toBuffer();
      const diff = Buffer.alloc(imageBuffer1.length);

      const difference = pixelmatch(imageBuffer1, imageBuffer2, diff, 800, 600, { threshold: 0.1 });
      const compatibility = 100 - difference * 100 / (800 * 600);
      this.logger.log(`${difference} pixels differents`);
      this.logger.log(`Compatibility: ${compatibility}%`);
      return {
        comparison: "The images are similar",
        pixelsDifference: `${difference} pixels differents`,
        compatibility: `Compatibility: ${compatibility}%`,
        message: "Images compared successfully",
      };
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  encrypt(data: string): IEncrypt {
    const iv = this.randomByte(16);
    return encryptData(data, iv);
  }

  decrypt(encryptedData: string, iv: string, authTag: string): any {
    const civ = iv;
    return this.encryptService.decryptData(encryptedData, civ, authTag);
  }

  randomByte(byte: number) {
    return crypto.randomBytes(byte);
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

}
