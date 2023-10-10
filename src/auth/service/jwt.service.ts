import { Injectable } from '@nestjs/common';
import { JwtService as Jwt } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customers } from '../auth.entity';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtService {
  @InjectRepository(Customers)
  private readonly repository: Repository<Customers>;

  private readonly jwt: Jwt;
  private readonly config: ConfigService;

  constructor(jwt: Jwt, config: ConfigService) {
    this.jwt = jwt;
    this.config = config;
  }

  // Decoding the JWT Token
  public async decode(token: string): Promise<unknown> {
    return this.jwt.decode(token, null);
  }

  // Get User by User ID we get from decode()
  public async validateUser(decoded: any): Promise<Customers> {
    return this.repository.findOne(decoded.id);
  }

  // Generate JWT Token
  public async generateToken(auth: Customers) {
    const { email, id } = auth;

    // return this.jwt.sign({ id: id, email: email });
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(
        {
          sub: auth.id,
          email,
        },
        {
          secret: this.config.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: this.config.get<string>('JWT_EXPIRE'),
        },
      ),
      this.jwt.signAsync(
        {
          sub: id,
          email,
        },
        {
          secret: this.config.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.config.get<string>('JWT_REFRESH_TOKEN_EXPIRE'),
        },
      ),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  // Validate User's password
  public isPasswordValid(password: string, userPassword: string): boolean {
    return bcrypt.compareSync(password, userPassword);
  }

  // Encode User's password
  public encodePassword(password: string): string {
    const salt: string = bcrypt.genSaltSync(10);

    return bcrypt.hashSync(password, salt);
  }

  // Validate JWT Token, throw forbidden error if JWT Token is invalid
  public async verify(token: string): Promise<any> {
    try {
      return this.jwt.verify(token);
    } catch (err) {}
  }
}
