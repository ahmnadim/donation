import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateProgramDto, UpdateProgramDto } from "../dto/program.dto";

@Injectable()
export class ProgramsService {
  constructor(private prisma: PrismaService) {}

  async create(createProgramDto: CreateProgramDto) {
    try {
      return await this.prisma.program.create({
        data: createProgramDto,
      });
    } catch (error) {
      if (error.code === "P2002") {
        throw new ConflictException("Program name already exists");
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.program.findMany({
      include: {
        _count: {
          select: {
            donations: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const program = await this.prisma.program.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            donations: true,
          },
        },
      },
    });

    if (!program) {
      throw new NotFoundException("Program not found");
    }

    return program;
  }

  async update(id: number, updateProgramDto: UpdateProgramDto) {
    try {
      const program = await this.prisma.program.update({
        where: { id },
        data: updateProgramDto,
      });

      if (!program) {
        throw new NotFoundException("Program not found");
      }

      return program;
    } catch (error) {
      if (error.code === "P2002") {
        throw new ConflictException("Program name already exists");
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.program.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === "P2025") {
        throw new NotFoundException("Program not found");
      }
      throw error;
    }
  }

  async findDonations(id: number) {
    const program = await this.prisma.program.findUnique({
      where: { id },
      include: {
        donations: {
          where: {
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
        },
      },
    });

    if (!program) {
      throw new NotFoundException("Program not found");
    }

    return program.donations;
  }
}
