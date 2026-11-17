import { IsNumber, IsOptional, IsPositive, Max } from 'class-validator';

export class CreateTtnDto {
  /** Parcel weight in kg; defaults to NOVA_POSHTA_DEFAULT_WEIGHT or 1. */
  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 3 })
  @IsPositive()
  @Max(30)
  weight?: number;
}
