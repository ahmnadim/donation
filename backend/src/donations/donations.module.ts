import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { DonationsService } from "./donations.service";
import { DonationsController } from "./donations.controller";
import { JwtMiddleware } from "src/middlewares/jwt.middleware";

@Module({
  providers: [DonationsService],
  controllers: [DonationsController],
})
export class DonationsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes(DonationsController);
  }
}
