import { ApiProperty } from "@nestjs/swagger";

export class BookDto {
  @ApiProperty({ type: "string" })
  readonly id: string;

  @ApiProperty({ type: "string" })
  readonly author: string;

  @ApiProperty({ type: "string" })
  readonly title: string;

  @ApiProperty({ type: "string" })
  readonly userId: string;

  @ApiProperty({ type: "number" })
  readonly isbn: number;

  @ApiProperty({ type: "string" })
  readonly createdAt: string;

  @ApiProperty({ type: "string" })
  readonly updatedAt: string;
}
