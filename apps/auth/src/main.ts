import { AuthModule } from './auth.module';
import { TCPConfig } from '../../ems-common/src/common/utils';
import { AUTH_SERVICE } from '../../ems-common/src/common/constant';
import { TcpExceptionFilter } from '../../common/filters';

async function bootstrap() {
  const app = await TCPConfig(AuthModule, AUTH_SERVICE);
  app.useGlobalFilters(new TcpExceptionFilter());

  await app.listen();
  console.log(`Microservice running successfully`);
}
bootstrap();
