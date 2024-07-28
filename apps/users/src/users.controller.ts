import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { ITCPPayload } from '../../ems-common/src/common/utils';
import {
  CreateUserInput,
  PaginatedUser,
  QueryusersArgs,
  UpdateBaseStatusInput,
  UpdateUserNameInput,
  UpdateUserPasswordInput,
  UpdateUserPersonalInput,
  User,
} from '../../../build/graphql';
import { ObjectId } from 'mongodb';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({ service: 'users', cmd: 'create' })
  create(payload: ITCPPayload<CreateUserInput>): Promise<User> {
    return this.usersService.create(payload.data, payload.user);
  }
  @MessagePattern({ service: 'users', cmd: 'findAll' })
  findAll(payload: ITCPPayload<QueryusersArgs>): Promise<PaginatedUser> {
    return this.usersService.findAll(payload.data, payload.user);
  }
  @MessagePattern({ service: 'users', cmd: 'findAllForAuth' })
  findAllForAuth(payload: ITCPPayload<QueryusersArgs>): Promise<PaginatedUser> {
    return this.usersService.findAllForAuth(payload.data, payload.user);
  }
  @MessagePattern({ service: 'users', cmd: 'authFindOne' })
  authFindOne(payload: ITCPPayload<ObjectId>): Promise<User> {
    return this.usersService.authFindOne(payload.data);
  }
  @MessagePattern({ service: 'users', cmd: 'findOne' })
  findOne(payload: ITCPPayload<ObjectId>): Promise<User> {
    return this.usersService.findOne(payload.data, payload.user);
  }

  @MessagePattern({ service: 'users', cmd: 'update' })
  update(payload: ITCPPayload<UpdateUserPersonalInput>): Promise<User> {
    return this.usersService.update(payload.data, payload.user);
  }
  @MessagePattern({ service: 'users', cmd: 'updateRefreshToken' })
  updateRefreshToken(
    payload: ITCPPayload<{ id: string; refreshToken: string }>,
  ): Promise<boolean> {
    return this.usersService.updateRefreshToken(payload.data, payload.user);
  }
  @MessagePattern({ service: 'users', cmd: 'updatePassword' })
  updatePassword(
    payload: ITCPPayload<UpdateUserPasswordInput>,
  ): Promise<boolean> {
    return this.usersService.updatePassword(payload.data, payload.user);
  }
  @MessagePattern({ service: 'users', cmd: 'updateUsername' })
  updateUsername(payload: ITCPPayload<UpdateUserNameInput>): Promise<User> {
    return this.usersService.updateUsername(payload.data, payload.user);
  }
  @MessagePattern({ service: 'users', cmd: 'updateStatus' })
  updateStatus(payload: ITCPPayload<UpdateBaseStatusInput>): Promise<User> {
    return this.usersService.updateStatus(payload.data, payload.user);
  }
  @MessagePattern({ service: 'users', cmd: 'remove' })
  remove(payload: ITCPPayload<ObjectId[]>): Promise<number> {
    return this.usersService.remove(payload.data, payload.user);
  }
  @MessagePattern({ service: 'users', cmd: 'restore' })
  restore(payload: ITCPPayload<ObjectId[]>): Promise<number> {
    return this.usersService.restore(payload.data, payload.user);
  }
}
