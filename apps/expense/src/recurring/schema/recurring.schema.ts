import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from '../../../../ems-common/src/schemas/base.schema';
import { SchemaTypes, Types, HydratedDocument } from 'mongoose';

import * as paginate from 'mongoose-paginate-v2';
import { mongooseDeleteOptions } from '../../../../ems-common/src/common/interface';
import * as MongooseDelete from 'mongoose-delete';
import { BaseStatus } from '../../../../../build/graphql';

export type ExpenseRecurringDocument = HydratedDocument<ExpenseRecurring>;
export enum RepeatType {
  daily = 'daily',
  weekly = 'weekly',
  monthly = 'monthly',
  yearly = 'yearly',
}

@Schema({ timestamps: true, strict: 'throw' })
export class ExpenseRecurring extends BaseSchema {
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  categoryId: Types.ObjectId;
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  accountId: Types.ObjectId;
  @Prop({ type: String, required: true })
  dateOrTime: string;
  @Prop({ type: Number, required: true })
  amount: number;
  @Prop({ type: String, enum: RepeatType, required: true })
  repeatType: RepeatType;
  @Prop({ type: String, enum: BaseStatus, required: true })
  status: BaseStatus;
}

export const ExpenseRecurringSchema =
  SchemaFactory.createForClass(ExpenseRecurring);
ExpenseRecurringSchema.plugin(paginate);
ExpenseRecurringSchema.plugin(MongooseDelete, mongooseDeleteOptions);
