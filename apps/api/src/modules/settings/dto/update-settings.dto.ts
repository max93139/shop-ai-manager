import { IsEmail, IsInt, IsOptional, IsString, Matches, Max, MaxLength, Min, ValidateIf } from 'class-validator';

export class UpdateSettingsDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  storeName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  supportPhone?: string;

  @IsOptional()
  @ValidateIf((_, value) => value !== '')
  @IsEmail({}, { message: 'Support email must be a valid email address' })
  supportEmail?: string;

  /** Numeric chat id (groups are negative) or an @channel username; empty clears it. */
  @IsOptional()
  @ValidateIf((_, value) => value !== '')
  @Matches(/^(-?\d{5,20}|@[A-Za-z0-9_]{5,32})$/, { message: 'Manager chat must be a numeric chat id or @username' })
  managerChatId?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1000)
  lowStockThreshold?: number;
}
