import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from "@nestjs/common";
import { DonationsService } from "./donations.service";
import { CreateDonationDto } from "./dto/create-donation.dto";
import { UpdateDonationDto } from "./dto/update-donation.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { Role } from "@prisma/client";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";

@ApiTags("donations")
@Controller("donations")
@UseGuards(RolesGuard)
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Post()
  @ApiOperation({ summary: "Create a new donation" })
  create(@Body() createDonationDto: CreateDonationDto, @Request() req: any) {
    return this.donationsService.create(createDonationDto, req.user.id);
  }

  @Get()
  // @UseGuards(RolesGuard)
  @ApiOperation({ summary: "Get all donations" })
  findAll(@Request() req: any) {
    console.log("get all donations.");

    return this.donationsService.findAll(req.user.id, req.user.role);
  }

  @Get("dashboard")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Get dashboard statistics (Admin only)" })
  getDashboardStats() {
    return this.donationsService.getDashboardStats();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a specific donation" })
  findOne(@Param("id") id: number, @Request() req: any) {
    return this.donationsService.findOne(id, req.user.id, req.user.role);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update a donation" })
  update(
    @Param("id") id: number,
    @Body() updateDonationDto: UpdateDonationDto,
    @Request() req: any
  ) {
    return this.donationsService.update(
      id,
      updateDonationDto,
      req.user.id,
      req.user.role
    );
  }

  @Delete(":id")
  @ApiOperation({ summary: "Soft delete a donation" })
  remove(@Param("id") id: number, @Request() req: any) {
    return this.donationsService.softDelete(id, req.user.id, req.user.role);
  }
}
