import { UserDto } from "src/users/dto/user-data.dto";
import { usersEntity } from "src/users/entities/users.entity";
import { IUserResponse } from "src/users/interfaces/user.interface";
import { status } from "./enums";

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