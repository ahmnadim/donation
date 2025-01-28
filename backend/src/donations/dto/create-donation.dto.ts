import {
  IsNumber,
  IsString,
  IsOptional,
  IsEnum,
  IsNotEmpty,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Status } from "@prisma/client";
import { Transform } from "class-transformer";

export class CreateDonationDto {
  @ApiProperty()
  @IsNotEmpty({ message: "Amount must be something." })
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  currency: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  // @ApiProperty()
  // @IsNotEmpty({ message: "Donor must present" })
  // donorId: number;

  @ApiProperty()
  @IsNumber()
  programId: number;

  @ApiProperty({ enum: Status })
  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}
