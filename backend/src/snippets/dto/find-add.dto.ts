import { IsOptional, IsInt, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class FindAllQueryDto {
  @IsOptional()
  @Type(() => Number) // Автоматически конвертирует строку в число
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  tag?: string; // Если нужен массив, можно добавить @IsArray()
}
