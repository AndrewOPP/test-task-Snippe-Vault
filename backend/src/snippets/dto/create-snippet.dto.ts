import { IsString, IsNotEmpty, IsArray, IsEnum, IsOptional, MaxLength } from 'class-validator';
import { SnippetType } from '../schemas/snippet.schema';
import {
  SNIPPET_CONTENT_MAX_LENGTH,
  SNIPPET_TAG_MAX_LENGTH,
  SNIPPET_TITLE_MAX_LENGTH,
} from '../snippet.constants';

export class CreateSnippetDto {
  @IsString()
  @IsNotEmpty({ message: 'Title cannot be empty' })
  @MaxLength(SNIPPET_TITLE_MAX_LENGTH, {
    message: `Title must be ${SNIPPET_TITLE_MAX_LENGTH} characters or less`,
  })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Content cannot be empty' })
  @MaxLength(SNIPPET_CONTENT_MAX_LENGTH, {
    message: `Content must be ${SNIPPET_CONTENT_MAX_LENGTH} characters or less`,
  })
  content: string;

  @IsArray()
  @IsString({ each: true })
  @MaxLength(SNIPPET_TAG_MAX_LENGTH, {
    each: true,
    message: `Each tag must be ${SNIPPET_TAG_MAX_LENGTH} characters or less`,
  })
  @IsOptional()
  tags?: string[];

  @IsEnum(SnippetType, { message: 'Type must be link, note, or command' })
  @IsNotEmpty()
  type: SnippetType;
}
