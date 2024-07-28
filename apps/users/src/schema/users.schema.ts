import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Address } from '../../../ems-common/src/schemas/address.schema';
import { BaseSchema } from '../../../ems-common/src/schemas/base.schema';
import { HydratedDocument } from 'mongoose';
import { BaseStatus, Gender } from '../../../../build/graphql';
import * as paginate from 'mongoose-paginate-v2';
import { mongooseDeleteOptions } from '../../../ems-common/src/common/interface';
import * as MongooseDelete from 'mongoose-delete';

export type UserDocument = HydratedDocument<User>;

class Personal {
  @Prop({ type: String, required: true })
  firstName: string;
  @Prop({ type: String, required: true })
  lastName: string;
  @Prop({ type: String, required: true })
  DOB: string;
  @Prop({ type: String, required: true })
  profileImage: string;
  @Prop({ type: String, required: true })
  coverImage: string;
  @Prop({ type: String, enum: Gender, required: true })
  gender: Gender;
  @Prop([{ type: String, required: true }])
  email: string[];
  @Prop([{ type: String, required: true }])
  phone: string[];
  @Prop({ type: Address, required: true })
  address: Address;
}

@Schema({ timestamps: true, strict: 'throw' })
export class User extends BaseSchema {
  @Prop({ type: Personal, required: true })
  personal: Personal;
  @Prop({ type: String, required: true })
  username: string;
  @Prop({ type: String, required: true })
  password: string;
  @Prop({ type: String, required: true })
  confirmPassword: string;
  @Prop({ type: String, required: true })
  role: string;
  @Prop({ type: String, enum: BaseStatus, required: true })
  status: BaseStatus;
  @Prop({ type: String })
  refreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ username: 1, deletedAt: 1 }, { unique: true });
UserSchema.index({ 'personal.email': 1, deletedAt: 1 }, { unique: true });
UserSchema.index({ 'personal.phone': 1, deletedAt: 1 }, { unique: true });
UserSchema.plugin(paginate);
UserSchema.plugin(MongooseDelete, mongooseDeleteOptions);
