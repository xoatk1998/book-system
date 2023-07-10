import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { AppRepository } from "../../app/app.repository";
import { IActivities } from "./activities.interface";

@Injectable()
export class ActivityRepository
  extends AppRepository<IActivities>
  implements OnApplicationBootstrap
{
  constructor(@InjectModel('Activity') model: Model<IActivities>) {
    super(model);
  }
  async onApplicationBootstrap(): Promise<void> {
    await this.createCollection();
  }

}
