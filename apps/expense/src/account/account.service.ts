import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ExpenseAccount,
  ExpenseAccountDocument,
} from './schema/account.schema';
import { PaginateModel } from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import {
  findAllResult,
  IJwtPayload,
  paginator,
  siFilter,
} from '../../../ems-common/src/common/utils';
import {
  BaseStatus,
  CreateExpenseAccountInput,
  PaginatedExpenseAccount,
  QueryexpenseAccountsArgs,
  UpdateBaseStatusInput,
  UpdateExpenseAccountInput,
} from '../../../../build/graphql';
import {
  C_A_S_E,
  D_A_S_E,
  F_A_S_E,
  R_A_S_E,
  U_A_S_E,
} from '../../../ems-common/src/common/constant';
import { AccountQuery } from '../../../common/serarch-query';
import { ObjectId } from 'mongodb';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(ExpenseAccount.name)
    private readonly accountModule: PaginateModel<ExpenseAccount> &
      SoftDeleteModel<ExpenseAccountDocument>, // @Inject(PUB_SUB) private readonly pubSub: RedisPubSub,
  ) {}

  async create(
    data: CreateExpenseAccountInput,
    user: IJwtPayload,
  ): Promise<ExpenseAccount> {
    const result = await this.accountModule.create({
      ...data,
      createdBy: user.sub,
      updatedBy: user.sub,
      status: BaseStatus.inactive,
    });
    if (!result) throw new InternalServerErrorException(C_A_S_E);
    // await this.pubSub.publish(USER_CREATED, { [USER_CREATED]: result });
    return result;
  }
  async findAll(
    data: QueryexpenseAccountsArgs,
    user: IJwtPayload,
  ): Promise<PaginatedExpenseAccount> {
    const query = {
      ...AccountQuery(data),
      ...siFilter(user),
    };
    const result = await paginator(query, data, this.accountModule);
    if (!result) throw new InternalServerErrorException(F_A_S_E);
    return findAllResult(result);
  }
  async findOne(id: ObjectId, user: IJwtPayload) {
    const result = await this.accountModule.findOne({
      _id: id,
      ...siFilter(user),
    });
    if (!result) throw new NotFoundException(F_A_S_E);
    return result;
  }
  async update(
    data: UpdateExpenseAccountInput,
    user: IJwtPayload,
  ): Promise<ExpenseAccount> {
    const result = await this.accountModule.findOneAndUpdate(
      { _id: data.id, ...siFilter(user) },
      {
        $set: {
          ...data,
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
    // await this.pubSub.publish(USER_PERSONAL_UPDATED, {
    //   [USER_PERSONAL_UPDATED]: result,
    // });
    return result;
  }
  async updateStatus(
    data: UpdateBaseStatusInput,
    user: IJwtPayload,
  ): Promise<ExpenseAccount> {
    const result = await this.accountModule.findOneAndUpdate(
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
    // await this.pubSub.publish(USER_STATUS_UPDATED, {
    //   [USER_STATUS_UPDATED]: result,
    // });
    return result;
  }
  async remove(ids: ObjectId[], user: IJwtPayload): Promise<number> {
    const result = await this.accountModule.delete(
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
    // await this.pubSub.publish(USER_DELETED, {
    //   [USER_DELETED]: ids,
    // });
    return result['modifiedCount'];
  }
  async restore(ids: ObjectId[], user: IJwtPayload): Promise<number> {
    const result = await this.accountModule.restore({
      _id: {
        $in: ids,
      },
      ...siFilter(user),
    });
    if (!result) {
      throw new InternalServerErrorException(R_A_S_E);
    }
    // await this.pubSub.publish(USER_RESTORE, {
    //   [USER_RESTORE]: ids,
    // });
    return result['modifiedCount'];
  }
}
