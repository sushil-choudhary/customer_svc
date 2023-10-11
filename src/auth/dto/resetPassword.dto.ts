import { IsEmail, IsString } from 'class-validator';
import { PasswordResetRequest } from '../customer.pb';

export class PasswordResetDto implements PasswordResetRequest {
  @IsEmail()
  public readonly email: string;

  @IsString()
  public readonly currentPassword: string;

  @IsString()
  public readonly newPassword: string;
}
