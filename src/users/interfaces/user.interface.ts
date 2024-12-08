export interface IUser {
  username: string;
  password: string;
  createdAt: Date;
}

export interface IUserResponse {
  id: number
  username: string;
  status: string;
  nickname
  createdAt: Date;
  updatedAt: Date;
}