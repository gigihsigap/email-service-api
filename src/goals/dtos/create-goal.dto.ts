import { Priority, Status } from '../enums';

export class CreateGoalDto {
  name: string;
  priority: Priority;
  status: Status;
  createdAt: string;
  updatedAt: string;
}
