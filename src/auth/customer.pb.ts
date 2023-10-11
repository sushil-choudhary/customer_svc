/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "customer";

export interface RegisterRequest {
  email: string;
  password: string;
  mobile: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
}

export interface RegisterResponse {
  status: number;
  error: string[];
}

/** Login */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: number;
  error: string[];
  accessToken: string;
  refreshToken: string;
}

/** Update Password */
export interface PasswordResetRequest {
  email: string;
  currentPassword: string;
  newPassword: string;
}

export interface PasswordResetResponse {
  status: number;
  error: string[];
}

/** Validate */
export interface ValidateRequest {
  token: string;
}

export interface ValidateResponse {
  status: number;
  error: string[];
  userId: number;
}

export const CUSTOMER_PACKAGE_NAME = "customer";

export interface CustomerServiceClient {
  register(request: RegisterRequest): Observable<RegisterResponse>;

  login(request: LoginRequest): Observable<LoginResponse>;

  updatePassword(request: PasswordResetRequest): Observable<PasswordResetResponse>;

  validate(request: ValidateRequest): Observable<ValidateResponse>;
}

export interface CustomerServiceController {
  register(request: RegisterRequest): Promise<RegisterResponse> | Observable<RegisterResponse> | RegisterResponse;

  login(request: LoginRequest): Promise<LoginResponse> | Observable<LoginResponse> | LoginResponse;

  updatePassword(
    request: PasswordResetRequest,
  ): Promise<PasswordResetResponse> | Observable<PasswordResetResponse> | PasswordResetResponse;

  validate(request: ValidateRequest): Promise<ValidateResponse> | Observable<ValidateResponse> | ValidateResponse;
}

export function CustomerServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["register", "login", "updatePassword", "validate"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("CustomerService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("CustomerService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const CUSTOMER_SERVICE_NAME = "CustomerService";
