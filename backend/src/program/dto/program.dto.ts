import { IsString, IsOptional, MinLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";

export class CreateProgramDto {
  @ApiProperty({ description: "The name of the program" })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiPropertyOptional({ description: "The description of the program" })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateProgramDto extends PartialType(CreateProgramDto) {}
