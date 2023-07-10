import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { AppRepository } from "../../app/app.repository";
import { IProject } from "./projects.interface";
import { Project } from "./schemas/projects.schema";

@Injectable()
export class ProjectRepository
  extends AppRepository<IProject>
  implements OnApplicationBootstrap
{
  constructor(@InjectModel(Project.name) model: Model<IProject>) {
    super(model);
  }
  async onApplicationBootstrap(): Promise<void> {
    await this.createCollection();
  }

  async findByIsbn(isbn: number) {
    return this.findOne({ isbn });
  }
}
