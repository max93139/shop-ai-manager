import { IsInt, IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class UpdateVariantDto {
  @IsOptional()
  @IsInt({ message: 'Stock must be a whole number' })
  @Min(0, { message: 'Stock cannot be negative' })
  stock?: number;

  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 }, { message: 'Price must be a number' })
  @IsPositive({ message: 'Price must be greater than 0' })
  price?: number;
}
