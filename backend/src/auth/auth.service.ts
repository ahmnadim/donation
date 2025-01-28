import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import { UsersService } from "../users/users.service";
import * as bcrypt from "bcrypt";
import { LoginDto } from "./dto/auth.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private prisma: PrismaService
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(userData: LoginDto) {
    const user = await this.usersService.findByEmail(userData.email);

    if (!user) {
      throw new HttpException(
        "E-mail is not registered.",
        HttpStatus.NOT_FOUND
      );
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    const access_token = jwt.sign(payload, process.env.JWT_SECRET);
    return {
      status: "success",
      data: {
        name: user.name,
        email: user.email,
        role: user.role,
        access_token,
      },
    };
  }
}
