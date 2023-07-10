export class CreateActivityDto {
  readonly userId: string;
  readonly projectId: string;
  readonly date: string;
  readonly hours: number;
  readonly minutes: number;
  readonly task: string;
}