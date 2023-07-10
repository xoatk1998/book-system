import { Module } from "@nestjs/common";
import { ProjectsService } from "./projects.service";
import { ProjectsController } from "./projects.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Project, ProjectSchema } from "./schemas/projects.schema";
import { ProjectRepository } from "./projects.repository";
import { ActivityRepository } from "./activities.repository";
import { Activity, ActivitySchema } from "./schemas/activities.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Project.name,
        schema: ProjectSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: Activity.name,
        schema: ActivitySchema,
      },
    ]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectRepository, ActivityRepository],
  exports: [ProjectsService, ProjectRepository, ActivityRepository],
})
export class ProjectsModule {}
