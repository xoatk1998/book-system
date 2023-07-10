import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  HttpStatus,
  Query,
  HttpCode,
  Res,
} from "@nestjs/common";
import { ProjectsService } from "./projects.service";
// import { CreateProjectDto } from "./dto/create-project.dto";
// import { UpdateProjectDto } from "./dto/update-project.dto";
import {
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
  ApiBody,
  ApiResponse,
  ApiQuery,
} from "@nestjs/swagger";
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from "../../decorators/user.decorator";
// import { JwtPayload } from '../auth/interfaces/payload.interface';
import { ProjectDto } from "./dto/projects.dto";
// import { IndexProjectFilter } from "./dto/get-project.dto";
import { IPagination } from "../../shared/pagination/pagination.header.interface";
import { Pagination } from "../../decorators/pagination.decorator";
import { setPaginationResponseHeader } from "../../shared/pagination/pagination.helper";
import { ACCESS_TOKEN_HEADER_NAME } from "../../shared/constants";
import { CreateActivityDto } from "./dto/createActivity.dto";

@ApiTags("project")
@ApiBearerAuth(ACCESS_TOKEN_HEADER_NAME)
@Controller("projects")
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}
  @Get("")
  @ApiQuery({
    name: "page",
    required: false,
    description: "Page number",
    type: "Number",
  })
  @ApiQuery({
    name: "perPage",
    required: false,
    description: "Items per page",
    type: "Number",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [ProjectDto],
    description: "Index projects success",
  })
  @ApiOperation({
    operationId: "indexProjects",
    summary: "View all project records",
    description: "View all project records",
  })
  async indexProjects() {
    const response = await this.projectsService.indexProjects();
    return response;
  }
  
  @Get("/activities")
  @ApiResponse({
    status: HttpStatus.OK,
    type: ProjectDto,
    description: "Get list activities detail",
  })
  @ApiOperation({
    operationId: "indexActivities",
    summary: "Index activities",
    description: "Index activities",
  })
  indexActivities() {
    return this.projectsService.fetchActivities();
  }

  @Post("/activities")
  @ApiResponse({
    status: HttpStatus.OK,
    type: ProjectDto,
    description: "Create activities",
  })
  @ApiOperation({
    operationId: "createActivities",
    summary: "Create activities",
    description: "Create activities",
  })
  createActivity(@Body() createActivityDto: CreateActivityDto) {
    return this.projectsService.createActivity(createActivityDto);
  }

  // @Put(":id")
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   type: ProjectDto,
  //   description: "Get project detail",
  // })
  // @ApiOperation({
  //   operationId: "updateProject",
  //   summary: "Update project records",
  //   description: "Update project records",
  // })
  // update(
  //   @Param("id") id: string,
  //   @Body() updateProjectDto: UpdateProjectDto,
  //   @User() userId
  // ) {
  //   return this.projectsService.update(id, updateProjectDto, userId);
  // }

  // @Delete(":id")
  // @HttpCode(HttpStatus.NO_CONTENT)
  // @ApiResponse({ status: HttpStatus.NO_CONTENT, description: "No Content" })
  // @ApiOperation({
  //   operationId: "deleteProject",
  //   summary: "Delete project records",
  //   description: "Delete project records",
  // })
  // remove(@Param("id") id: string, @User() userId) {
  //   return this.projectsService.removeProject(id, userId);
  // }
}
