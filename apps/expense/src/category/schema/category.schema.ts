import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from '../../../../ems-common/src/schemas/base.schema';
import * as paginate from 'mongoose-paginate-v2';
import { mongooseDeleteOptions } from '../../../../ems-common/src/common/interface';
import * as MongooseDelete from 'mongoose-delete';
import { HydratedDocument } from 'mongoose';
import { BaseStatus } from '../../../../../build/graphql';

export type ExpenseCategoryDocument = HydratedDocument<ExpenseCategory>;
@Schema({ timestamps: true, strict: 'throw' })
export class ExpenseCategory extends BaseSchema {
  @Prop({ type: String, required: true })
  name: string;
  @Prop({ type: String })
  description: string;
  @Prop({ type: String, enum: BaseStatus, required: true })
  status: BaseStatus;
}

export const ExpenseCategorySchema =
  SchemaFactory.createForClass(ExpenseCategory);
ExpenseCategorySchema.index(
  { name: 1, deletedAt: 1, createdBy: 1, updatedBy: 1 },
  { unique: true },
);
ExpenseCategorySchema.plugin(paginate);
ExpenseCategorySchema.plugin(MongooseDelete, mongooseDeleteOptions);
