import {
  QueryexpenseAccountsArgs,
  QueryexpenseBudgetsArgs,
  QueryexpenseCategoriesArgs,
  QueryexpenseRecurringsArgs,
  QueryexpenseTransactionsArgs,
  QueryusersArgs,
} from '../../build/graphql';
import { QueryOptions } from 'mongoose';

const commonQuery = (data: any) => {
  const { ids } = data;
  return {
    ...(ids && { _id: { $in: ids } }),
  };
};
export const UserQuery = (data: QueryusersArgs) => {
  const { username, status } = data;
  return {
    ...(username && { username }),
    ...(status && { status }),
    ...commonQuery(data),
  };
};
export const AccountQuery = (data: QueryexpenseAccountsArgs) => {
  const { type, status } = data;
  return {
    ...(type && { type }),
    ...(status && { status }),
    ...commonQuery(data),
  };
};
export const BudgetQuery = (data: QueryexpenseBudgetsArgs) => {
  const { categoryId, status } = data;
  return {
    ...(categoryId && { categoryId }),
    ...(status && { status }),
    ...commonQuery(data),
  };
};
export const CategoryQuery = (data: QueryexpenseCategoriesArgs) => {
  const { name, status } = data;
  return {
    ...(name && { name: new RegExp(name, 'i') }),
    ...(status && { status }),
    ...commonQuery(data),
  };
};
export const RecurringQuery = (data: QueryexpenseRecurringsArgs) => {
  const { categoryId, accountId, status } = data;
  return {
    ...(categoryId && { categoryId }),
    ...(accountId && { accountId }),
    ...(status && { status }),
    ...commonQuery(data),
  };
};
export const TransactionQuery = (data: QueryexpenseTransactionsArgs) => {
  const { categoryId, accountId, status, type } = data;
  return {
    ...(type && { type: new RegExp(type, 'i') }),
    ...(categoryId && { categoryId }),
    ...(accountId && { accountId }),
    ...(status && { status }),
    ...commonQuery(data),
  };
};
// export async function CustomPaginator<T>(
//   query: any,
//   data: any,
//   model: any, // Ensure to import and use Mongoose's Model interface
// ): Promise<PaginateResult<T>> {
//   let customFind = 'find';
//   let useCustomCountFn: () => Promise<number>;
//
//   switch (data.deleted) {
//     case DeleteFilter.include:
//       customFind = 'findWithDeleted';
//       useCustomCountFn = async (): Promise<number> =>
//         model.countDocumentsWithDeleted(query);
//       break;
//     case DeleteFilter.only:
//       customFind = 'findDeleted';
//       useCustomCountFn = async (): Promise<number> =>
//         model.countDocumentsDeleted(query);
//       break;
//     case DeleteFilter.exclude:
//     default:
//       customFind = 'find';
//       useCustomCountFn = async (): Promise<number> =>
//         model.countDocuments(query);
//       break;
//   }
//
//   const sortOptions = data.sortBy ? data.sortBy : { createdAt: 'desc' };
//   const options = {
//     page: data.page,
//     limit: data.perPage,
//     projection: data.projection,
//     sort: sortOptions,
//     customFind,
//     customLabels: {
//       meta: 'paginate',
//     },
//   };
//
//   if (useCustomCountFn) {
//     options['useCustomCountFn'] = useCustomCountFn;
//   }
//
//   return await model.paginate(query, options);
// }
export const CustomPaginator = <
  T,
  U extends Pick<
    QueryusersArgs,
    'sortBy' | 'perPage' | 'page' | 'delete' | 'projection'
  >,
>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  model: any /*mongoose.PaginateModel<T>*/,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  query: QueryOptions,
  data: U,
): any => {
  let customFind = 'find';
  if (data?.delete === 'include') {
    customFind = 'findWithDeleted';
  } else if (data?.delete === 'only') {
    customFind = 'findDeleted';
  }
  let sort = {
    createdAt: 'desc',
  };
  if (data?.sortBy && data.sortBy?.createdAt) {
    sort = data.sortBy;
  } else if (data?.sortBy) {
    sort = {
      ...data.sortBy,
      createdAt: 'desc',
    };
  }

  return {
    page: data.page,
    limit: data.perPage,
    projection: data.projection,
    sort,
    ...(data?.perPage && { limit: data.perPage }),
    ...(data?.page && { page: data.page }),
    ...(customFind === 'findWithDeleted' && {
      customFind,
      useCustomCountFn: async (): Promise<number> => {
        return model.countDocumentsWithDeleted(query);
      },
    }),
    ...(customFind === 'findDeleted' && {
      customFind,
      useCustomCountFn: async (): Promise<number> => {
        return model.countDocumentsDeleted(query);
      },
    }),
    ...(customFind === 'find' && {
      customFind,
      useCustomCountFn: async (): Promise<number> => {
        return model.countDocuments(query);
      },
    }),

    customFind,
    customLabels: {
      meta: 'paginate',
    },
  };
};
