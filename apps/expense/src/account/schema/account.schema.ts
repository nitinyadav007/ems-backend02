// src/schemas/account.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';
import * as MongooseDelete from 'mongoose-delete';
import { mongooseDeleteOptions } from '../../../../ems-common/src/common/interface';
import { BaseSchema } from '../../../../ems-common/src/schemas/base.schema';
import { BaseStatus } from '../../../../../build/graphql';

export type ExpenseAccountDocument = HydratedDocument<ExpenseAccount>;

@Schema({ timestamps: true, strict: 'throw' })
export class ExpenseAccount extends BaseSchema {
  @Prop({ type: String, required: true })
  type: string; // e.g., 'checking', 'savings', 'credit'
  @Prop({ type: String, required: true })
  balance: number;
  @Prop({ type: String })
  description: string;
  @Prop({ type: String, enum: BaseStatus, required: true })
  status: BaseStatus;
}

export const ExpenseAccountSchema =
  SchemaFactory.createForClass(ExpenseAccount);
ExpenseAccountSchema.index(
  { type: 1, createdBy: 1, updatedBy: 1, deletedAt: 1 },
  { unique: true },
);
ExpenseAccountSchema.plugin(paginate);
ExpenseAccountSchema.plugin(MongooseDelete, mongooseDeleteOptions);
