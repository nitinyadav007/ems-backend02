import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { ObjectId } from 'mongodb';
import { AccountService } from './account.service';
import { ITCPPayload } from '../../../ems-common/src/common/utils';
import {
  CreateExpenseAccountInput,
  ExpenseAccount,
  PaginatedExpenseAccount,
  QueryexpenseAccountsArgs,
  UpdateBaseStatusInput,
  UpdateExpenseAccountInput,
} from '../../../../build/graphql';

@Controller()
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @MessagePattern({ service: 'expenseAccount', cmd: 'create' })
  create(
    payload: ITCPPayload<CreateExpenseAccountInput>,
  ): Promise<ExpenseAccount> {
    return this.accountService.create(payload.data, payload.user);
  }
  @MessagePattern({ service: 'expenseAccount', cmd: 'findAll' })
  findAll(
    payload: ITCPPayload<QueryexpenseAccountsArgs>,
  ): Promise<PaginatedExpenseAccount> {
    return this.accountService.findAll(payload.data, payload.user);
  }
  @MessagePattern({ service: 'expenseAccount', cmd: 'findOne' })
  findOne(payload: ITCPPayload<ObjectId>): Promise<ExpenseAccount> {
    return this.accountService.findOne(payload.data, payload.user);
  }
  @MessagePattern({ service: 'expenseAccount', cmd: 'update' })
  update(
    payload: ITCPPayload<UpdateExpenseAccountInput>,
  ): Promise<ExpenseAccount> {
    return this.accountService.update(payload.data, payload.user);
  }
  @MessagePattern({ service: 'expenseAccount', cmd: 'updateStatus' })
  updateStatus(
    payload: ITCPPayload<UpdateBaseStatusInput>,
  ): Promise<ExpenseAccount> {
    return this.accountService.updateStatus(payload.data, payload.user);
  }
  @MessagePattern({ service: 'expenseAccount', cmd: 'remove' })
  remove(payload: ITCPPayload<ObjectId[]>): Promise<number> {
    return this.accountService.remove(payload.data, payload.user);
  }
  @MessagePattern({ service: 'expenseAccount', cmd: 'restore' })
  restore(payload: ITCPPayload<ObjectId[]>): Promise<number> {
    return this.accountService.restore(payload.data, payload.user);
  }
}
