import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ObjectId } from 'mongodb';
import { ITCPPayload } from '../../../ems-common/src/common/utils';
import { CategoryService } from './category.service';
import {
  CreateExpenseCategoryInput,
  ExpenseCategory,
  PaginatedExpenseCategory,
  QueryexpenseCategoriesArgs,
  UpdateBaseStatusInput,
  UpdateExpenseCategoryInput,
} from '../../../../build/graphql';

@Controller()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @MessagePattern({ service: 'expenseCategory', cmd: 'create' })
  create(
    payload: ITCPPayload<CreateExpenseCategoryInput>,
  ): Promise<ExpenseCategory> {
    return this.categoryService.create(payload.data, payload.user);
  }
  @MessagePattern({ service: 'expenseCategory', cmd: 'findAll' })
  findAll(
    payload: ITCPPayload<QueryexpenseCategoriesArgs>,
  ): Promise<PaginatedExpenseCategory> {
    return this.categoryService.findAll(payload.data, payload.user);
  }
  @MessagePattern({ service: 'expenseCategory', cmd: 'findOne' })
  findOne(payload: ITCPPayload<ObjectId>): Promise<ExpenseCategory> {
    return this.categoryService.findOne(payload.data, payload.user);
  }
  @MessagePattern({ service: 'expenseCategory', cmd: 'update' })
  update(
    payload: ITCPPayload<UpdateExpenseCategoryInput>,
  ): Promise<ExpenseCategory> {
    return this.categoryService.update(payload.data, payload.user);
  }
  @MessagePattern({ service: 'expenseCategory', cmd: 'updateStatus' })
  updateStatus(
    payload: ITCPPayload<UpdateBaseStatusInput>,
  ): Promise<ExpenseCategory> {
    return this.categoryService.updateStatus(payload.data, payload.user);
  }
  @MessagePattern({ service: 'expenseCategory', cmd: 'remove' })
  remove(payload: ITCPPayload<ObjectId[]>): Promise<number> {
    return this.categoryService.remove(payload.data, payload.user);
  }
  @MessagePattern({ service: 'expenseCategory', cmd: 'restore' })
  restore(payload: ITCPPayload<ObjectId[]>): Promise<number> {
    return this.categoryService.restore(payload.data, payload.user);
  }
}
