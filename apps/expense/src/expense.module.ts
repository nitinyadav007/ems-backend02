import { Module } from '@nestjs/common';
import { TransactionController } from './transaction/transaction.controller';
import { TransactionService } from './transaction/transaction.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ExpenseTransaction,
  ExpenseTransactionSchema,
} from './transaction/schema/transaction.schema';
import { DatabaseModule } from 'apps/ems-common/src/common/database/database.module';
import { GlobalConfigModule } from '../../ems-common/src/common/config/globalConfig.module';
import { CategoryService } from './category/category.service';
import { CategoryController } from './category/category.controller';
import {
  ExpenseCategory,
  ExpenseCategorySchema,
} from './category/schema/category.schema';
import { RecurringService } from './recurring/recurring.service';
import { RecurringController } from './recurring/recurring.controller';
import {
  ExpenseRecurring,
  ExpenseRecurringSchema,
} from './recurring/schema/recurring.schema';
import { BudgetController } from './budget/budget.controller';
import { BudgetService } from './budget/budget.service';
import {
  ExpenseBudget,
  ExpenseBudgetSchema,
} from './budget/schema/budget.schema';
import { AccountService } from './account/account.service';
import { AccountController } from './account/account.controller';
import {
  ExpenseAccount,
  ExpenseAccountSchema,
} from './account/schema/account.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ExpenseAccount.name, schema: ExpenseAccountSchema },
      { name: ExpenseBudget.name, schema: ExpenseBudgetSchema },
      { name: ExpenseCategory.name, schema: ExpenseCategorySchema },
      { name: ExpenseRecurring.name, schema: ExpenseRecurringSchema },
      { name: ExpenseTransaction.name, schema: ExpenseTransactionSchema },
    ]),
    // RedisPubSubModule,
    GlobalConfigModule,

    DatabaseModule,
  ],
  controllers: [
    AccountController,
    BudgetController,
    RecurringController,
    CategoryController,
    TransactionController,
  ],
  providers: [
    AccountService,
    BudgetService,
    RecurringService,
    CategoryService,
    TransactionService,
  ],
})
export class ExpenseModule {}
