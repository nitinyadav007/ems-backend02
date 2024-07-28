import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TCPProvider } from '../../ems-common/src/common/utils';
import { USERS_SERVICE } from '../../ems-common/src/common/constant';
import { GlobalConfigModule } from '../../ems-common/src/common/config/globalConfig.module';
import { DatabaseModule } from '../../ems-common/src/common/database/database.module';

@Module({
  imports: [
    GlobalConfigModule,

    JwtModule.register({
      secret: 'XAUUSD',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, TCPProvider(USERS_SERVICE)],
})
export class AuthModule {}
