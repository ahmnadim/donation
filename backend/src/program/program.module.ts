import { Module } from "@nestjs/common";
import { ProgramsController } from "./controllers/program.controller";
import { ProgramsService } from "./services/program.service";

@Module({
  controllers: [ProgramsController],
  providers: [ProgramsService],
  imports: [],
})
export class ProgramModule {}
