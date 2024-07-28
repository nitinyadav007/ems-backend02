import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/users.schema';
import { GlobalConfigModule } from '../../ems-common/src/common/config/globalConfig.module';
import { GlobalPubSubModule } from '../../ems-common/src/common/pubsub/pubsub.module';
import { DatabaseModule } from '../../ems-common/src/common/database/database.module';

@Module({
  imports: [
    GlobalPubSubModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    GlobalConfigModule,
    DatabaseModule,
    // MongooseModule.forRoot(
    //   'mongodb+srv://noti:noti12345@nitinyadav.vj6i9hr.mongodb.net/',
    // ),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
