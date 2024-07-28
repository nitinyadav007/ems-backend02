import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ObjectId } from 'mongodb';
import { ITCPPayload } from '../../../ems-common/src/common/utils';
import { RecurringService } from './recurring.service';
import {
  CreateExpenseRecurringInput,
  ExpenseRecurring,
  PaginatedExpenseRecurring,
  QueryexpenseRecurringsArgs,
  UpdateBaseStatusInput,
  UpdateExpenseRecurringInput,
} from '../../../../build/graphql';

@Controller()
export class RecurringController {
  constructor(private readonly recurringService: RecurringService) {}

  @MessagePattern({ service: 'expenseCategory', cmd: 'create' })
  create(
    payload: ITCPPayload<CreateExpenseRecurringInput>,
  ): Promise<ExpenseRecurring> {
    return this.recurringService.create(payload.data, payload.user);
  }
  @MessagePattern({ service: 'expenseCategory', cmd: 'findAll' })
  findAll(
    payload: ITCPPayload<QueryexpenseRecurringsArgs>,
  ): Promise<PaginatedExpenseRecurring> {
    return this.recurringService.findAll(payload.data, payload.user);
  }
  @MessagePattern({ service: 'expenseCategory', cmd: 'findOne' })
  findOne(payload: ITCPPayload<ObjectId>): Promise<any> {
    return this.recurringService.findOne(payload.data, payload.user);
  }
  @MessagePattern({ service: 'expenseCategory', cmd: 'update' })
  update(payload: ITCPPayload<UpdateExpenseRecurringInput>): Promise<any> {
    return this.recurringService.update(payload.data, payload.user);
  }
  @MessagePattern({ service: 'expenseCategory', cmd: 'updateStatus' })
  updateStatus(payload: ITCPPayload<UpdateBaseStatusInput>): Promise<any> {
    return this.recurringService.updateStatus(payload.data, payload.user);
  }
  @MessagePattern({ service: 'expenseCategory', cmd: 'remove' })
  remove(payload: ITCPPayload<ObjectId[]>): Promise<number> {
    return this.recurringService.remove(payload.data, payload.user);
  }
  @MessagePattern({ service: 'expenseCategory', cmd: 'restore' })
  restore(payload: ITCPPayload<ObjectId[]>): Promise<number> {
    return this.recurringService.restore(payload.data, payload.user);
  }
}
