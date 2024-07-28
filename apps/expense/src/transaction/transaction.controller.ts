import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ObjectId } from 'mongodb';
import { ITCPPayload } from '../../../ems-common/src/common/utils';
import { TransactionService } from './transaction.service';
import {
  CreateExpenseTransactionInput,
  ExpenseTransaction,
  PaginatedExpenseTransaction,
  QueryexpenseTransactionsArgs,
  UpdateExpenseTransactionInput,
  UpdateExpenseTransactionStatusInput,
} from '../../../../build/graphql';

@Controller()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @MessagePattern({ service: 'expenseTransaction', cmd: 'create' })
  create(
    payload: ITCPPayload<CreateExpenseTransactionInput>,
  ): Promise<ExpenseTransaction> {
    return this.transactionService.create(payload.data, payload.user);
  }
  @MessagePattern({ service: 'expenseTransaction', cmd: 'findAll' })
  findAll(
    payload: ITCPPayload<QueryexpenseTransactionsArgs>,
  ): Promise<PaginatedExpenseTransaction> {
    return this.transactionService.findAll(payload.data, payload.user);
  }
  @MessagePattern({ service: 'expenseTransaction', cmd: 'findOne' })
  findOne(payload: ITCPPayload<ObjectId>): Promise<ExpenseTransaction> {
    return this.transactionService.findOne(payload.data, payload.user);
  }
  @MessagePattern({ service: 'expenseTransaction', cmd: 'update' })
  update(
    payload: ITCPPayload<UpdateExpenseTransactionInput>,
  ): Promise<ExpenseTransaction> {
    return this.transactionService.update(payload.data, payload.user);
  }
  @MessagePattern({ service: 'expenseTransaction', cmd: 'updateStatus' })
  updateStatus(
    payload: ITCPPayload<UpdateExpenseTransactionStatusInput>,
  ): Promise<ExpenseTransaction> {
    return this.transactionService.updateStatus(payload.data, payload.user);
  }
  @MessagePattern({ service: 'expenseTransaction', cmd: 'remove' })
  remove(payload: ITCPPayload<ObjectId[]>): Promise<number> {
    return this.transactionService.remove(payload.data, payload.user);
  }
  @MessagePattern({ service: 'expenseTransaction', cmd: 'restore' })
  restore(payload: ITCPPayload<ObjectId[]>): Promise<number> {
    return this.transactionService.restore(payload.data, payload.user);
  }
}
