import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  LoginRequestDto,
  RegisterRequestDto,
  ValidateRequestDto,
} from './auth.dto';
import {
  CUSTOMER_SERVICE_NAME,
  RegisterResponse,
  LoginResponse,
  ValidateResponse,
  PasswordResetResponse,
} from './customer.pb';
import { AuthService } from './service/auth.service';
import { PasswordResetDto } from './dto/resetPassword.dto';

@Controller()
export class AuthController {
  @Inject(AuthService)
  private readonly service: AuthService;

  @GrpcMethod(CUSTOMER_SERVICE_NAME, 'Register')
  private register(payload: RegisterRequestDto): Promise<RegisterResponse> {
    return this.service.register(payload);
  }

  @GrpcMethod(CUSTOMER_SERVICE_NAME, 'Login')
  private login(payload: LoginRequestDto): Promise<LoginResponse> {
    return this.service.login(payload);
  }

  @GrpcMethod(CUSTOMER_SERVICE_NAME, 'UpdatePassword')
  private updatePassword(
    payload: PasswordResetDto,
  ): Promise<PasswordResetResponse> {
    return this.service.updatePassword(payload);
  }

  @GrpcMethod(CUSTOMER_SERVICE_NAME, 'Validate')
  private validate(payload: ValidateRequestDto): Promise<ValidateResponse> {
    return this.service.validate(payload);
  }
}
