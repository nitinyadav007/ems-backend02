import { TCPConfig } from '../../ems-common/src/common/utils';
import { EXPENSE_SERVICE } from '../../ems-common/src/common/constant';
import { TcpExceptionFilter } from '../../common/filters';
import { ExpenseModule } from './expense.module';

async function bootstrap() {
  const app = await TCPConfig(ExpenseModule, EXPENSE_SERVICE);
  app.useGlobalFilters(new TcpExceptionFilter());
  await app.listen();
  console.log(`Expense Servicec running successfully`);
}

bootstrap();
