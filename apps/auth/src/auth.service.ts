import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { F_A_S_E, USERS_SERVICE } from '../../ems-common/src/common/constant';
import { ClientProxy } from '@nestjs/microservices';
import { QueryusersArgs, User } from '../../../build/graphql';
import {
  EUserType,
  IJwtPayload,
  sendRequest,
} from '../../ems-common/src/common/utils';
import { LoginUserDto } from '../../users/src/dto/create-user.dto';
import { ObjectId } from 'mongodb';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USERS_SERVICE) private userClient: ClientProxy,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await sendRequest<any, QueryusersArgs>(
      'findAllForAuth',
      { username: username, page: 1, perPage: 1 },
      null,
      'users',
      this.userClient,
    );
    if (user && user.docs.length === 0) {
      throw new InternalServerErrorException(F_A_S_E);
    }
    if (user && (await bcrypt.compare(password, user.docs[0].password))) {
      return user.docs[0];
    }
    return null;
  }
  async updateUserRefreshToken(
    data: { id: string; refreshToken: string },
    user: IJwtPayload,
  ) {
    try {
      const result = await sendRequest(
        'updateRefreshToken',
        data,
        user,
        'users',
        this.userClient,
      );
      if (!result) {
        throw new InternalServerErrorException(
          'Error when update refresh token in user',
        );
      }
      return result;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(
        'Error when update refresh token in user',
      );
    }
  }
  async loginUser(
    loginUserDto: LoginUserDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.validateUser(
      loginUserDto.username,
      loginUserDto.password,
    );
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const payload = {
      username: user.username,
      sub: user.id,
      type: EUserType.USER,
    };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    await this.updateUserRefreshToken(
      {
        id: user.id,
        refreshToken,
      },
      {
        sub: new Types.ObjectId(user.id),
        type: EUserType.USER,
      },
    );
    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(
    token: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const decoded = this.jwtService.verify(token);
      if (!decoded) {
        throw new Error('Invalid refresh token');
      }
      const payload = {
        username: decoded.username,
        sub: decoded.sub,
        type: decoded.type,
      };
      const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
      const refreshToken = this.jwtService.sign(payload, {
        expiresIn: '7d',
      });
      await this.updateUserRefreshToken(
        {
          id: decoded.sub,
          refreshToken: refreshToken,
        },
        {
          sub: new Types.ObjectId(decoded.sub),
          type: EUserType.USER,
        },
      );
      return { accessToken, refreshToken };
    } catch (e) {
      throw new Error('Invalid refresh token');
    }
  }
  async findOne(id: ObjectId): Promise<User> {
    const result = await sendRequest<User, ObjectId>(
      'authFindOne',
      id,
      null,
      'users',
      this.userClient,
    );
    if (!result) {
      throw new InternalServerErrorException(F_A_S_E);
    }
    return result;
  }
}
