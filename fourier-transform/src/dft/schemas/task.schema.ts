import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TaskStatus } from '../enum/task-status.enum';

@Schema({ toJSON: { getters: true } })
export class Task {
  @Prop(TaskStatus)
  status: TaskStatus;

  @Prop({ type: [String] })
  subtaskIds: string[];

  @Prop({ type: String })
  result: string;

  @Prop({ type: Date, UTC: true, isRequired: true })
  executionStart: Date;

  @Prop({ type: Date, UTC: true, isRequired: true })
  executionEnd: Date;
}

export type TaskDocument = HydratedDocument<Task>;
export const TaskSchema = SchemaFactory.createForClass(Task);

TaskSchema.virtual('executionTime').get(function () {
  return (
    new Date(this.executionEnd).getTime() -
    new Date(this.executionStart).getTime()
  );
});
