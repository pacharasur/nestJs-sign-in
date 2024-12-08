import { usersEntity } from "src/users/entities/users.entity";
import { IUserResponse } from "src/users/interfaces/user.interface";

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
