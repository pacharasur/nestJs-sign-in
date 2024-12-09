export interface IUser {
  username: string;
  password: string;
  createdAt: Date;
}

export interface IUserResponse {
  id: number;
  username: string;
  status: string;
  nickname: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IComparisonResponse {
  comparison: string;
  message: string;
}