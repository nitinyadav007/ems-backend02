import { UsersModule } from './users.module';
import { TCPConfig } from '../../ems-common/src/common/utils';
import { USERS_SERVICE } from '../../ems-common/src/common/constant';
import { UsersService } from './users.service';
import { Types } from 'mongoose';
import { TcpExceptionFilter } from '../../common/filters';

async function bootstrap() {
  const app = await TCPConfig(UsersModule, USERS_SERVICE);
  app.useGlobalFilters(new TcpExceptionFilter());
  await app.listen();
  console.log(`Microservice running successfully`);
  const user = {
    sub: new Types.ObjectId('61b5d4c8a0c3e5af9f6a7d8d'),
    type: 'admin',
  };
  const xx = app.get(UsersService);
  // await xx.findAll(
  //   {
  //     page: 1,
  //     limit: 10,
  //   },
  //   user,
  // );
  // await xx.remove([new Types.ObjectId('668d510e44f92225c514e983')], user);
  // await xx.restore([new Types.ObjectId('668d510e44f92225c514e983')], user);
  // await xx.create(
  //   {
  //     username: 'test',
  //     password: 'test',
  //     confirmPassword: 'test',
  //     status: BaseStatus.active,
  //     personal: {
  //       firstName: 'test',
  //       lastName: 'test',
  //       email: ['notiyadav@gmail.com'],
  //       phone: ['8813949932'],
  //       DOB: '2024-01-05',
  //       gender: Gender.male,
  //       address: {
  //         city: 'test',
  //         country: 'Bharat',
  //         pinCode: 2323,
  //         state: 'Alwar',
  //         street: 'wew',
  //       },
  //       coverImage: 'null',
  //       profileImage: 'null',
  //     },
  //   },
  //   {
  //     sub: new Types.ObjectId('61b5d4c8a0c3e5af9f6a7d8d'),
  //     type: 'admin',
  //   },
  // );
}

bootstrap();
