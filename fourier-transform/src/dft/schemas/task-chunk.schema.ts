import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { TaskStatus } from '../enum/task-status.enum';
import { Task } from './task.schema';

@Schema()
export class TaskChunk {
  @Prop(TaskStatus)
  status: TaskStatus;

  @Prop({ type: String })
  jobId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Task' })
  task: Task;
}

export type TaskChunkDocument = HydratedDocument<TaskChunk>;
export const TaskChunkSchema = SchemaFactory.createForClass(TaskChunk);
