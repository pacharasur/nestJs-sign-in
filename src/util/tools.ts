import { UserDto } from "src/users/dto/user-data.dto";
import { usersEntity } from "src/users/entities/users.entity";
import { IUserResponse } from "src/users/interfaces/user.interface";
import { status } from "./enums";
import { IEncrypt } from "src/users/interfaces/encrypt.interface";

export function populateToUserResponse(user: usersEntity): IUserResponse {
  return {
    id: user.id,
    username: user.user_name,
    nickname: user.nickname,
    status: user.status,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  } as IUserResponse;
}

export function populateToUserEntity(user: UserDto, hashedPassword: string, imageBase64: string): usersEntity {
  return Object.assign({
    avatar: imageBase64,
    user_name: user.username,
    password: hashedPassword,
    nickname: user.nickname,
    status: status.ACTIVE,
    created_at: new Date(),
    updated_at: new Date(),
  }) as usersEntity;
}

export function convertImageToBase64(imageBuffer: Buffer): string {
  return Buffer.from(imageBuffer).toString('base64');
}

export function convertBufferToHex(buffer: Buffer): string {
  return buffer.toString('hex');
}

export function convertHexToBuffer(buffer: string): Buffer {
  return Buffer.from(buffer, 'hex');
}

export function encryptData(password: string, privateKey: Buffer, iv: Buffer): IEncrypt {
  const crypto = require('crypto');

  const cipher = crypto.createCipheriv('AES-256-GCM', privateKey, iv);
  let encrypted = cipher.update(password, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();

  return { encryptedData: encrypted, iv: convertBufferToHex(iv), authTag: convertBufferToHex(authTag) } as IEncrypt;
}

export function decryptData(encryptedData: string, privateKey: Buffer, iv: Buffer, authTag: string): string {
  const crypto = require('crypto');

  const decipher = crypto.createDecipheriv('AES-256-GCM', privateKey, iv);
  decipher.setAuthTag(convertHexToBuffer(authTag));
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}