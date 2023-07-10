import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ActivityDocument = Activity & Document;

@Schema({
  timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
})
export class Activity {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  projectId: string;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  hours: number;

  @Prop({ required: true })
  minutes: number;

  @Prop({ required: true })
  task: string;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
