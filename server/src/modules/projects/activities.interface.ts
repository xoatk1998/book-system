import { Document } from "mongoose";

export interface IActivities extends Document {
  id?: string;
  userId: string;
  projectId: string;
  date: string;
  hours: number;
  minutes: number;
  task: string;
}
