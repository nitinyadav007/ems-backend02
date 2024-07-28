import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { ITCPPayload } from '../../ems-common/src/common/utils';
import { AuthResponse, LoginUserInput } from '../../../build/graphql';
import { ObjectId } from 'mongodb';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ service: 'auth', cmd: 'login' })
  loginUser(payload: ITCPPayload<LoginUserInput>): Promise<AuthResponse> {
    return this.authService.loginUser(payload.data);
  }

  @MessagePattern({ service: 'auth', cmd: 'refreshToken' })
  refreshToken(refreshToken: ITCPPayload<string>): Promise<AuthResponse> {
    return this.authService.refreshToken(refreshToken.data);
  }
  @MessagePattern({ service: 'auth', cmd: 'updateRefreshToken' })
  updateUserRefreshToken(
    payload: ITCPPayload<{ id: string; refreshToken: string }>,
  ): Promise<any> {
    return this.authService.updateUserRefreshToken(payload.data, payload.user);
  }
  @MessagePattern({ service: 'auth', cmd: 'findOne' })
  findOne(payload: ITCPPayload<ObjectId>) {
    return this.authService.findOne(payload.data);
  }
}
