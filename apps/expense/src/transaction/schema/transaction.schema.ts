// src/schemas/transaction.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { BaseSchema } from '../../../../ems-common/src/schemas/base.schema';
import * as paginate from 'mongoose-paginate-v2';
import { mongooseDeleteOptions } from '../../../../ems-common/src/common/interface';
import * as MongooseDelete from 'mongoose-delete';
import { TransactionStatus } from '../../../../../build/graphql';

export type ExpenseTransactionDocument = HydratedDocument<ExpenseTransaction>;
export enum TransactionType {
  income = 'income',
  expense = 'expense',
}
@Schema({ timestamps: true, strict: 'throw' })
export class ExpenseTransaction extends BaseSchema {
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  accountId: Types.ObjectId;
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  categoryId: Types.ObjectId;
  @Prop({ type: String, enum: TransactionType, required: true })
  type: TransactionType;
  @Prop({ type: String, required: true })
  amount: number;
  @Prop({ type: Boolean, required: true })
  isAutoApplied: boolean;
  @Prop({ type: String })
  description: string;
  @Prop({ type: String, enum: TransactionStatus, required: true })
  status: TransactionStatus;
}

export const ExpenseTransactionSchema =
  SchemaFactory.createForClass(ExpenseTransaction);
ExpenseTransactionSchema.plugin(paginate);
ExpenseTransactionSchema.plugin(MongooseDelete, mongooseDeleteOptions);
