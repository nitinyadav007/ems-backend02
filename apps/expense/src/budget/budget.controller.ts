import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { ObjectId } from 'mongodb';
import { ITCPPayload } from '../../../ems-common/src/common/utils';
import { BudgetService } from './budget.service';
import {
  CreateExpenseBudgetInput,
  ExpenseBudget,
  PaginatedExpenseBudget,
  QueryexpenseBudgetsArgs,
  UpdateBaseStatusInput,
  UpdateExpenseBudgetInput,
} from '../../../../build/graphql';

@Controller()
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @MessagePattern({ service: 'expenseBudget', cmd: 'create' })
  create(
    payload: ITCPPayload<CreateExpenseBudgetInput>,
  ): Promise<ExpenseBudget> {
    return this.budgetService.create(payload.data, payload.user);
  }
  @MessagePattern({ service: 'expenseBudget', cmd: 'findAll' })
  findAll(
    payload: ITCPPayload<QueryexpenseBudgetsArgs>,
  ): Promise<PaginatedExpenseBudget> {
    return this.budgetService.findAll(payload.data, payload.user);
  }
  @MessagePattern({ service: 'expenseBudget', cmd: 'findOne' })
  findOne(payload: ITCPPayload<ObjectId>): Promise<ExpenseBudget> {
    return this.budgetService.findOne(payload.data, payload.user);
  }
  @MessagePattern({ service: 'expenseBudget', cmd: 'update' })
  update(
    payload: ITCPPayload<UpdateExpenseBudgetInput>,
  ): Promise<ExpenseBudget> {
    return this.budgetService.update(payload.data, payload.user);
  }
  @MessagePattern({ service: 'expenseBudget', cmd: 'updateStatus' })
  updateStatus(
    payload: ITCPPayload<UpdateBaseStatusInput>,
  ): Promise<ExpenseBudget> {
    return this.budgetService.updateStatus(payload.data, payload.user);
  }
  @MessagePattern({ service: 'expenseBudget', cmd: 'remove' })
  remove(payload: ITCPPayload<ObjectId[]>): Promise<number> {
    return this.budgetService.remove(payload.data, payload.user);
  }
  @MessagePattern({ service: 'expenseBudget', cmd: 'restore' })
  restore(payload: ITCPPayload<ObjectId[]>): Promise<number> {
    return this.budgetService.restore(payload.data, payload.user);
  }
}
