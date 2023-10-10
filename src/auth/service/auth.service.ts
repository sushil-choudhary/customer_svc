import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from './jwt.service';
import {
  RegisterRequestDto,
  LoginRequestDto,
  ValidateRequestDto,
} from '../auth.dto';
import { Customers } from '../auth.entity';
import {
  LoginResponse,
  RegisterResponse,
  ValidateResponse,
} from '../customer.pb';
import { ERRORS } from 'src/helpers/constant';

@Injectable()
export class AuthService {
  @InjectRepository(Customers)
  private readonly repository: Repository<Customers>;

  @Inject(JwtService)
  private readonly jwtService: JwtService;

  public async register(
    payload: RegisterRequestDto,
  ): Promise<RegisterResponse> {
    const userExists: Customers = await this.repository.findOne({
      where: { email: payload.email },
    });

    if (userExists) {
      return {
        status: HttpStatus.CONFLICT,
        error: [ERRORS.EMAIL_ALREADY_EXISTS],
      };
    }

    const newUser = {
      ...payload,
      password: this.jwtService.encodePassword(payload.password),
    };

    await this.repository.save(newUser);

    return { status: HttpStatus.CREATED, error: null };
  }

  public async login({
    email,
    password,
  }: LoginRequestDto): Promise<LoginResponse> {
    const auth: Customers = await this.repository.findOne({ where: { email } });

    if (!auth) {
      return {
        status: HttpStatus.NOT_FOUND,
        error: [ERRORS.EMAIL_NOT_FOUND],
        accessToken: null,
        refreshToken: null,
      };
    }

    const isPasswordValid: boolean = this.jwtService.isPasswordValid(
      password,
      auth.password,
    );

    if (!isPasswordValid) {
      return {
        status: HttpStatus.NOT_FOUND,
        error: [ERRORS.PASSOWRD_WRONG],
        accessToken: null,
        refreshToken: null,
      };
    }

    const token: any = await this.jwtService.generateToken(auth);
    const response = {
      refreshToken: token.refreshToken,
      accessToken: token.accessToken,
      status: HttpStatus.OK,
      error: null,
    };

    return response;
  }

  public async validate({
    token,
  }: ValidateRequestDto): Promise<ValidateResponse> {
    const decoded: Customers = await this.jwtService.verify(token);

    if (!decoded) {
      return {
        status: HttpStatus.FORBIDDEN,
        error: [ERRORS.TOKEN_INVALID],
        userId: null,
      };
    }

    const auth: Customers = await this.jwtService.validateUser(decoded);

    if (!auth) {
      return {
        status: HttpStatus.CONFLICT,
        error: [ERRORS.USER_NOT_FOUND],
        userId: null,
      };
    }

    return { status: HttpStatus.OK, error: null, userId: decoded.id };
  }
}
