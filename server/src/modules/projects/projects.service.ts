import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { getHeaders } from "../../shared/pagination/pagination.helper";
import { Errors } from "../../errors/errors";
import { IPagination } from "../../shared/pagination/pagination.header.interface";
import { ProjectRepository } from "./projects.repository";
// import { CreateProjectDto } from "./dto/create-project.dto";
// import { IndexProjectFilter } from "./dto/get-project.dto";
// import { UpdateProjectDto } from "./dto/update-project.dto";
import { Project, ProjectDocument } from "./schemas/projects.schema";
import { Logger, PinoLogger } from "nestjs-pino";
import { ActivityRepository } from "./activities.repository";
import { CreateActivityDto } from "./dto/createActivity.dto";

@Injectable()
export class ProjectsService {
  constructor(
    private readonly activityRepository: ActivityRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly logger: PinoLogger
  ) {}

  // async createProject(createProjectDto: CreateProjectDto, userId: string): Promise<ProjectDocument> {
  //   const existProject = await this.projectRepository.findByIsbn(+createProjectDto.isbn);
  //   if (existProject) {
  //     throw new BadRequestException(Errors.EXIST_BOOK);
  //   }
  //   try {
  //     return this.projectRepository.create({
  //       ...createProjectDto,
  //       userId: userId
  //     });
  //   } catch (error) {
  //     this.logger.error("ProjectsService::createProject error", error);
  //     throw new InternalServerErrorException(Errors.INTERNAL_SERVER_ERROR)
  //   }
  // }

  async indexProjects() {
    const projects = await this.projectRepository
      .find({});
    if (!projects.length) {
      throw new NotFoundException(Errors.BOOK_NOT_FOUND);
    }

    return projects;
  }

  async fetchActivities() {
    const activities = await this.activityRepository.find({});
    if (!activities.length) {
      throw new NotFoundException(Errors.BOOK_NOT_FOUND);
    }

    return activities;
  }

  async createActivity(input: CreateActivityDto) {
    const activity = await this.activityRepository.create(input);
    return activity;
  }


  // async getProjectDetail(transactionId: string, userId: string) {
  //   const project = await this.projectRepository.findOne({ _id: transactionId, userId });
  //   if (!project) {
  //     throw new NotFoundException(Errors.BOOK_NOT_FOUND);
  //   }

  //   return project;
  // }

  // async update(id: string, updateProjectDto: UpdateProjectDto, userId: string) {
  //   try {
  //     await this.getProjectDetail(id, userId);
  //     return this.projectRepository.updateOne(
  //       { _id: id },
  //       { $set: updateProjectDto }
  //     );
  //   } catch (error) {
  //     this.logger.error("ProjectsService::update error", error);
  //     throw new InternalServerErrorException(Errors.INTERNAL_SERVER_ERROR)
  //   }
  // }

  // async removeProject(id: string, userId: string) {
  //   try {
  //     await this.getProjectDetail(id, userId);
  //     const removeSuccess = await this.projectRepository.deleteOne({_id: id});
  //     return !!removeSuccess;
  //   } catch (error) {
  //     this.logger.error("ProjectsService::removeProject error", error);
  //     throw new InternalServerErrorException(Errors.INTERNAL_SERVER_ERROR)
  //   }
  // }
}
