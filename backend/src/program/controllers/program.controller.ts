import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from "@nestjs/common";

import { Role } from "@prisma/client";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "src/auth/decorators/roles.decorator";
import { CreateProgramDto, UpdateProgramDto } from "../dto/program.dto";
import { ProgramsService } from "../services/program.service";

@ApiTags("programs")
@Controller("programs")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Create a new program (Admin only)" })
  create(@Body() createProgramDto: CreateProgramDto) {
    return this.programsService.create(createProgramDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all programs" })
  findAll() {
    return this.programsService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a specific program" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.programsService.findOne(id);
  }

  @Put(":id")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Update a program (Admin only)" })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateProgramDto: UpdateProgramDto
  ) {
    return this.programsService.update(id, updateProgramDto);
  }

  @Delete(":id")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Delete a program (Admin only)" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.programsService.remove(id);
  }

  @Get(":id/donations")
  @ApiOperation({ summary: "Get all donations for a specific program" })
  findDonations(@Param("id", ParseIntPipe) id: number) {
    return this.programsService.findDonations(id);
  }
}
