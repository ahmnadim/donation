import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateDonationDto } from "./dto/create-donation.dto";
import { UpdateDonationDto } from "./dto/update-donation.dto";

@Injectable()
export class DonationsService {
  constructor(private prisma: PrismaService) {}

  async create(createDonationDto: CreateDonationDto, userId: number) {
    return this.prisma.donation.create({
      data: {
        ...createDonationDto,
        donorId: userId,
      },
    });
  }

  async findAll(userId: number, role: string) {
    const where = role === "ADMIN" ? {} : { donorId: userId };
    return this.prisma.donation.findMany({
      where: {
        ...where,
        deletedAt: null,
      },
      include: {
        donor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        program: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });
  }

  async findOne(id: number, userId: number, role: string) {
    const where = role === "ADMIN" ? { id } : { id, donorId: userId };
    const donation = await this.prisma.donation.findFirst({
      where: {
        ...where,
        deletedAt: null,
      },
      include: {
        donor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!donation) {
      throw new NotFoundException("Donation not found");
    }

    return donation;
  }

  async update(
    id: number,
    updateDonationDto: UpdateDonationDto,
    userId: number,
    role: string
  ) {
    const where = role === "ADMIN" ? { id } : { id, donorId: userId };
    const donation = await this.prisma.donation.findFirst({
      where: {
        ...where,
        deletedAt: null,
      },
    });

    if (!donation) {
      throw new NotFoundException("Donation not found");
    }

    return this.prisma.donation.update({
      where: { id },
      data: updateDonationDto,
    });
  }

  async softDelete(id: number, userId: number, role: string) {
    const where = role === "ADMIN" ? { id } : { id, donorId: userId };
    const donation = await this.prisma.donation.findFirst({
      where: {
        ...where,
        deletedAt: null,
      },
    });

    if (!donation) {
      throw new NotFoundException("Donation not found");
    }

    return this.prisma.donation.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async getDashboardStats() {
    const [totalDonations, totalAmount, uniqueDonors, recentDonations] =
      await Promise.all([
        // Get total number of donations
        this.prisma.donation.count({
          where: { deletedAt: null },
        }),
        // Get total amount of donations
        this.prisma.donation.aggregate({
          where: { deletedAt: null },
          _sum: {
            amount: true,
          },
        }),
        // Get total number of unique donors
        this.prisma.donation.groupBy({
          by: ["donorId"],
          where: { deletedAt: null },
        }),
        // Get recent donations
        this.prisma.donation.findMany({
          where: { deletedAt: null },
          orderBy: { createdAt: "desc" },
          take: 5,
          include: {
            donor: {
              select: {
                name: true,
                email: true,
              },
            },
            program: {
              select: {
                name: true,
              },
            },
          },
        }),
      ]);

    const avgDonation = totalAmount._sum.amount / totalDonations;

    return {
      totalDonations,
      totalAmount: totalAmount._sum.amount,
      totalDonors: uniqueDonors.length,
      avgDonation,
      recentDonations: recentDonations.map((donation) => ({
        id: donation.id,
        amount: donation.amount,
        currency: donation.currency,
        donorName: donation.donor.name,
        programName: donation.program.name,
        createdAt: donation.createdAt,
      })),
    };
  }
}
