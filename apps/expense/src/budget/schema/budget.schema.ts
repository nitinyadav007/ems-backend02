// src/schemas/budget.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { BaseSchema } from '../../../../ems-common/src/schemas/base.schema';
import * as paginate from 'mongoose-paginate-v2';
import { mongooseDeleteOptions } from '../../../../ems-common/src/common/interface';
import * as MongooseDelete from 'mongoose-delete';
import { BaseStatus } from '../../../../../build/graphql';

export type ExpenseBudgetDocument = HydratedDocument<ExpenseBudget>;

@Schema({ timestamps: true, strict: 'throw' })
export class ExpenseBudget extends BaseSchema {
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  categoryId: Types.ObjectId;
  @Prop({ required: true })
  amount: number;
  @Prop({ type: String, required: true })
  startDate: string;
  @Prop({ type: String, required: true })
  endDate: string;
  @Prop({ type: String, enum: BaseStatus, required: true })
  status: BaseStatus;
}

export const ExpenseBudgetSchema = SchemaFactory.createForClass(ExpenseBudget);
ExpenseBudgetSchema.plugin(paginate);
ExpenseBudgetSchema.plugin(MongooseDelete, mongooseDeleteOptions);
