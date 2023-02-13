import {
  IsNotEmpty,
  IsString,
  IsNumber,
  MaxLength,
  MinLength,
  Min,
  IsOptional,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class UpdateBookDto {
  @IsString()
  @IsOptional()
  @MinLength(5)
  @ApiProperty({
    type: "string",
    description: "author",
    example: "Robert C. Martin",
  })
  author?: string;

  @IsString()
  @IsOptional()
  @MinLength(5)
  @MaxLength(300)
  @ApiProperty({
    type: "string",
    description: "title",
    example: "Clean Code",
    maxLength: 300,
    minLength: 5,
  })
  title?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @ApiProperty({
    type: "number",
    description: "ISBN Number",
    example: "123",
    minimum: 0,
  })
  isbn?: number;
}
