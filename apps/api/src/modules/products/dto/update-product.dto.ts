import { Transform } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty({ message: 'Product name cannot be empty' })
  @MaxLength(200)
  name?: string;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty({ message: 'Category cannot be empty' })
  @MaxLength(100)
  category?: string;

  /** Empty string clears the brand. */
  @IsOptional()
  @IsString()
  @MaxLength(100)
  brand?: string;

  /** Full replacement list: existing image URLs to keep plus new data URLs. */
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5)
  @IsString({ each: true })
  images?: string[];
}
