import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { DonationsModule } from "./donations/donations.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ProgramModule } from "./program/program.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    DonationsModule,
    ProgramModule,
  ],
})
export class AppModule {}
