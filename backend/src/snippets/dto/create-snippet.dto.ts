import { IsString, IsNotEmpty, IsArray, IsEnum, IsOptional } from 'class-validator';
import { SnippetType } from '../schemas/snippet.schema';

export class CreateSnippetDto {
  @IsString()
  @IsNotEmpty({ message: 'Название не может быть пустым' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Контент не может быть пустым' })
  content: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsEnum(SnippetType, { message: 'Тип должен быть link, note или command' })
  @IsNotEmpty()
  type: SnippetType;
}
