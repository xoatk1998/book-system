import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class IndexBookFilter {
  @IsOptional()
  @ApiPropertyOptional({
    type: "string",
    description: "userId",
  })
  title?: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: "string",
    description: "author",
  })
  author?: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: "number",
    description: "isbn",
  })
  isbn?: number;
}
