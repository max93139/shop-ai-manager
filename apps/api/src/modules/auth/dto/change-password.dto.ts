import { IsString, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @MinLength(1, { message: 'Current password is required' })
  currentPassword!: string;

  /** bcrypt ignores everything after 72 bytes, so longer passwords are rejected rather than silently truncated. */
  @IsString()
  @MinLength(8, { message: 'New password must be at least 8 characters' })
  @MaxLength(72, { message: 'New password must be at most 72 characters' })
  newPassword!: string;
}
