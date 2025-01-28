import { ApiParam, ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, Min, MinLength } from "class-validator";

export class LoginDto {
  @ApiProperty()
  @IsNotEmpty({ message: "E-mail must not empty." })
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: "Password must not empty" })
  @MinLength(6, { message: "Password should ne minimum six charactar long." })
  password: string;
}
