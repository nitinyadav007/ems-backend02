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
  CreateExpenseCategoryInput,
  PaginatedExpenseCategory,
  QueryexpenseCategoriesArgs,
  UpdateBaseStatusInput,
  UpdateExpenseCategoryInput,
} from '../../../../build/graphql';
import {
  C_A_S_E,
  D_A_S_E,
  F_A_S_E,
  R_A_S_E,
  U_A_S_E,
} from '../../../ems-common/src/common/constant';
import { CategoryQuery } from '../../../common/serarch-query';
import { ObjectId } from 'mongodb';
import {
  ExpenseCategory,
  ExpenseCategoryDocument,
} from './schema/category.schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(ExpenseCategory.name)
    private readonly categoryService: PaginateModel<ExpenseCategory> &
      SoftDeleteModel<ExpenseCategoryDocument>, // @Inject(PUB_SUB) private readonly pubSub: RedisPubSub,
  ) {}

  async create(
    data: CreateExpenseCategoryInput,
    user: IJwtPayload,
  ): Promise<ExpenseCategory> {
    const result = await this.categoryService.create({
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
    data: QueryexpenseCategoriesArgs,
    user: IJwtPayload,
  ): Promise<PaginatedExpenseCategory> {
    const query = {
      ...CategoryQuery(data),
      ...siFilter(user),
    };
    const result = await paginator(query, data, this.categoryService);
    if (!result) throw new InternalServerErrorException(F_A_S_E);
    return findAllResult(result);
  }
  async findOne(id: ObjectId, user: IJwtPayload) {
    const result = await this.categoryService.findOne({
      _id: id,
      ...siFilter(user),
    });
    if (!result) throw new NotFoundException(F_A_S_E);
    return result;
  }
  async update(
    data: UpdateExpenseCategoryInput,
    user: IJwtPayload,
  ): Promise<ExpenseCategory> {
    const result = await this.categoryService.findOneAndUpdate(
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
  ): Promise<ExpenseCategory> {
    const result = await this.categoryService.findOneAndUpdate(
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
    const result = await this.categoryService.delete(
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
    const result = await this.categoryService.restore({
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
