import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";

export class UserDto {

  @IsEmail({}, { message: 'ต้องเป็น email เท่านั้น' })
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*\d)(?=.*[\W_]).{8,}$/, {
    message: 'password อย่างน้อย 8 ตัวอักษร มีตัวเลขอย่างน้อย 1 ตัว ตัวอักขระพิเศษอย่างน้อย 1 ตัว',
  })
  password: string;

  @IsString()
  @IsOptional()
  nickname: string;
}


export class UserDetailDto {

  @IsEmail()
  @IsNotEmpty()
  username: string;

  @IsString()
  status: string;

  @IsString()
  @IsOptional()
  nickname: string;
}
