import { UserDto } from "src/users/dto/user-data.dto";
import { usersEntity } from "src/users/entities/users.entity";
import { IUserResponse } from "src/users/interfaces/user.interface";
import { status } from "./enums";
import { IEncrypt } from "src/users/interfaces/encrypt.interface";
import { activityLogsEntity } from "src/activity-logs/entities/activity-logs.entity";
import { IActivityResponse } from "src/activity-logs/interfaces/user.interface";

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

export function populateToActivityEntity(username: string, method: string, url: string, code: string, status: number, description: string): activityLogsEntity {
  return Object.assign({
    user_name: username,
    method: method,
    url: url,
    code: code,
    status: status,
    description: description,
    created_at: new Date(),
  }) as activityLogsEntity;
}

export function populateToActivityResponse(activity: activityLogsEntity): IActivityResponse {
  return {
    username: activity.user_name,
    method: activity.method,
    url: activity.url,
    code: activity.code,
    status: activity.status,
    description: activity.description,
    createdAt: new Date(),
  } as IActivityResponse;
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

export function encryptData(password: string, iv: Buffer): IEncrypt {
  const crypto = require('crypto');
  const privateKey = getPrivateKeyBuffer();

  const cipher = crypto.createCipheriv('AES-256-GCM', privateKey, iv);
  let encrypted = cipher.update(password, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();

  return { encryptedData: encrypted, iv: convertBufferToHex(iv), authTag: convertBufferToHex(authTag) } as IEncrypt;
}

export function getPrivateKeyBuffer(): Buffer {
  const key = process.env.PRIVATE_KEY;
  const privateKey = Buffer.from(key, 'hex');
  return privateKey;
}

export function passwordRegex(password: string): boolean {
  const passwordRegex = /^(?=.*\d)(?=.*[\W_]).{8,}$/;
  const validPass = passwordRegex.test(password);
  return validPass;
}
