import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
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
  CreateExpenseBudgetInput,
  PaginatedExpenseBudget,
  QueryexpenseBudgetsArgs,
  UpdateBaseStatusInput,
  UpdateExpenseBudgetInput,
} from '../../../../build/graphql';
import {
  C_A_S_E,
  D_A_S_E,
  F_A_S_E,
  R_A_S_E,
  U_A_S_E,
} from '../../../ems-common/src/common/constant';
import { BudgetQuery } from '../../../common/serarch-query';
import { ObjectId } from 'mongodb';
import { ExpenseBudget, ExpenseBudgetDocument } from './schema/budget.schema';

@Injectable()
export class BudgetService {
  constructor(
    @InjectModel(ExpenseBudget.name)
    private readonly budgetModel: PaginateModel<ExpenseBudget> &
      SoftDeleteModel<ExpenseBudgetDocument>, // @Inject(PUB_SUB) private readonly pubSub: RedisPubSub,
  ) {}

  async create(
    data: CreateExpenseBudgetInput,
    user: IJwtPayload,
  ): Promise<ExpenseBudget> {
    const result = await this.budgetModel.create({
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
    data: QueryexpenseBudgetsArgs,
    user: IJwtPayload,
  ): Promise<PaginatedExpenseBudget> {
    const query = {
      ...BudgetQuery(data),
      ...siFilter(user),
    };
    const result = await paginator(query, data, this.budgetModel);
    if (!result) throw new InternalServerErrorException(F_A_S_E);
    return findAllResult(result);
  }
  async findOne(id: ObjectId, user: IJwtPayload) {
    const result = await this.budgetModel.findOne({
      _id: id,
      ...siFilter(user),
    });
    if (!result) throw new NotFoundException(F_A_S_E);
    return result;
  }
  async update(
    data: UpdateExpenseBudgetInput,
    user: IJwtPayload,
  ): Promise<ExpenseBudget> {
    const result = await this.budgetModel.findOneAndUpdate(
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
  ): Promise<ExpenseBudget> {
    const result = await this.budgetModel.findOneAndUpdate(
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
    const result = await this.budgetModel.delete(
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
    const result = await this.budgetModel.restore({
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
