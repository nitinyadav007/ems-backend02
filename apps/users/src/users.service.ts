import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/users.schema';
import { PaginateModel, Types } from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import * as bcrypt from 'bcrypt';
import {
  BaseStatus,
  CreateUserInput,
  PaginatedUser,
  QueryusersArgs,
  UpdateUserNameInput,
  UpdateUserPasswordInput,
  UpdateUserPersonalInput,
  USER_CREATED,
  USER_DELETED,
  USER_NAME_UPDATED,
  USER_PASSWORD_UPDATED,
  USER_PERSONAL_UPDATED,
  USER_RESTORE,
  USER_STATUS_UPDATED,
} from '../../../build/graphql';
import { UserQuery } from '../../common/serarch-query';
import { ObjectId } from 'mongodb';
import {
  C_A_S_E,
  D_A_S_E,
  F_A_S_E,
  R_A_S_E,
  U_A_S_E,
} from '../../ems-common/src/common/constant';
import { PUB_SUB } from '../../ems-common/src/common/pubsub/pubsub.module';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import {
  findAllResult,
  IJwtPayload,
  paginator,
  siFilter,
} from '../../ems-common/src/common/utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: PaginateModel<User> &
      SoftDeleteModel<UserDocument>,
    @Inject(PUB_SUB) private readonly pubSub: RedisPubSub,
  ) {}

  async create(data: CreateUserInput, user: IJwtPayload): Promise<User> {
    const userEmailOrPhone = await this.userModel.findOne({
      'personal.email': data.personal.email,
      'personal.phone': data.personal.phone,
    });
    if (userEmailOrPhone) {
      throw new InternalServerErrorException('Email already taken.');
    }
    const userExists = await this.userModel.findOne({
      username: data.username,
    });
    if (userExists) {
      throw new InternalServerErrorException('Username already taken.');
    }
    const { password, confirmPassword } = data;
    if (password !== confirmPassword) {
      throw new InternalServerErrorException('Passwords do not match');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await this.userModel.create({
      ...data,
      password: hashedPassword,
      confirmPassword: hashedPassword,
      createdBy: new Types.ObjectId(),
      updatedBy: new Types.ObjectId(),
      status: BaseStatus.active,
      role: 'user',
    });
    if (!result) {
      throw new InternalServerErrorException(C_A_S_E);
    }
    await this.pubSub.publish(USER_CREATED, {
      [USER_CREATED]: result,
    });
    return result;
  }

  async findAll(
    data: QueryusersArgs,
    user: IJwtPayload,
  ): Promise<PaginatedUser> {
    const query = {
      ...UserQuery(data),
      ...siFilter(user),
    };
    const result = await paginator(query, data, this.userModel);
    if (!result) throw new InternalServerErrorException(F_A_S_E);
    return findAllResult(result);
  }
  async findAllForAuth(
    data: QueryusersArgs,
    user: IJwtPayload,
  ): Promise<PaginatedUser> {
    const query = {
      ...UserQuery(data),
    };
    const result = await paginator(query, data, this.userModel);
    if (!result) throw new InternalServerErrorException(F_A_S_E);
    return findAllResult(result);
  }

  async findOne(id: ObjectId, user: IJwtPayload) {
    const result = await this.userModel.findOne({ _id: id, ...siFilter(user) });
    if (!result) throw new BadRequestException(F_A_S_E);
    return result;
  }
  async authFindOne(id: ObjectId) {
    const result = await this.userModel.findOne({ _id: id });
    if (!result) throw new NotFoundException(F_A_S_E);
    return result;
  }
  async update(
    data: UpdateUserPersonalInput,
    user: IJwtPayload,
  ): Promise<User> {
    const result = await this.userModel.findOneAndUpdate(
      { _id: data.id, ...siFilter(user) },
      {
        $set: {
          personal: data.personal,
          updatedBy: user.sub,
        },
      },
      {
        new: true,
      },
    );
    if (!result) {
      throw new InternalServerErrorException(U_A_S_E);
    }
    await this.pubSub.publish(USER_PERSONAL_UPDATED, {
      [USER_PERSONAL_UPDATED]: result,
    });
    return result;
  }
  async updatePassword(
    data: UpdateUserPasswordInput,
    user: IJwtPayload,
  ): Promise<boolean> {
    const result = await this.userModel.findOneAndUpdate(
      { _id: data.id, ...siFilter(user) },
      {
        $set: {
          password: data.password,
          confirmPassword: data.confirmPassword,
          updatedBy: user.sub,
        },
      },
      {
        new: true,
      },
    );
    if (!result) {
      throw new InternalServerErrorException(U_A_S_E);
    }
    await this.pubSub.publish(USER_PASSWORD_UPDATED, {
      [USER_PASSWORD_UPDATED]: true,
    });
    return true;
  }
  async updateUsername(
    data: UpdateUserNameInput,
    user: IJwtPayload,
  ): Promise<User> {
    const result = await this.userModel.findOneAndUpdate(
      { _id: data.id, ...siFilter(user) },
      {
        $set: {
          username: data.username,
          updatedBy: user.sub,
        },
      },
      {
        new: true,
      },
    );
    if (!result) {
      throw new InternalServerErrorException(U_A_S_E);
    }
    await this.pubSub.publish(USER_NAME_UPDATED, {
      [USER_NAME_UPDATED]: result,
    });
    return result;
  }
  async updateStatus(data: any, user: IJwtPayload): Promise<User> {
    const result = await this.userModel.findOneAndUpdate(
      { _id: data.id, ...siFilter(user) },
      {
        $set: {
          status: data.status,
          updatedBy: user.sub,
        },
      },
      {
        new: true,
      },
    );
    if (!result) {
      throw new InternalServerErrorException(U_A_S_E);
    }
    await this.pubSub.publish(USER_STATUS_UPDATED, {
      [USER_STATUS_UPDATED]: result,
    });
    return result;
  }
  async updateRefreshToken(
    data: { id: string; refreshToken: string },
    user: IJwtPayload,
  ): Promise<boolean> {
    const result = await this.userModel.findOneAndUpdate(
      { _id: data.id },
      {
        $set: {
          refreshToken: data.refreshToken,
          updatedBy: user.sub,
        },
      },
      {
        new: true,
      },
    );
    if (!result) {
      throw new InternalServerErrorException(U_A_S_E);
    }
    return true;
  }
  async remove(ids: ObjectId[], user: IJwtPayload): Promise<number> {
    const result = await this.userModel.delete(
      {
        _id: {
          $in: ids,
        },
        ...siFilter(user),
      },
      user.sub,
    );
    if (!result) {
      throw new InternalServerErrorException(D_A_S_E);
    }
    await this.pubSub.publish(USER_DELETED, {
      [USER_DELETED]: ids,
    });
    return result['modifiedCount'];
  }
  async restore(ids: ObjectId[], user: IJwtPayload): Promise<number> {
    const result = await this.userModel.restore({
      _id: {
        $in: ids,
      },
      ...siFilter(user),
    });
    if (!result) {
      throw new InternalServerErrorException(R_A_S_E);
    }
    await this.pubSub.publish(USER_RESTORE, {
      [USER_RESTORE]: ids,
    });
    return result['modifiedCount'];
  }
}
