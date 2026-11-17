import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Product name is required' })
  @MaxLength(200)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  brand?: string;

  /** The admin form sends the price as a string; it is converted before validation. */
  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 }, { message: 'Price must be a number' })
  @IsPositive({ message: 'Price must be greater than 0' })
  price!: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  selectedSizes?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  selectedColors?: string[];

  /** Keys are a size, or `color:::size` for a single variant. */
  @IsOptional()
  @IsObject()
  sizeStocks?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  variantStocks?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  colorStocks?: Record<string, unknown>;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'inStock must be a whole number' })
  @Min(0)
  inStock?: number;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5)
  @IsString({ each: true })
  images?: string[];
}
