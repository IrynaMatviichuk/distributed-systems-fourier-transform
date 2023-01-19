import { IsArray, IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateTaskDto {
  @IsArray()
  @IsNumber({}, { each: true })
  signal: number[];

  @IsNumber()
  @IsInt()
  @Min(1)
  @IsOptional()
  split?: number;
}
