import { ApiProperty } from "@nestjs/swagger";

export class UseResponseDto {
  @ApiProperty({
    type: String,
  })
  userId: string;

  @ApiProperty({
    type: String,
  })
  name: string;

  @ApiProperty({
    type: String,
  })
  email: string;
}
