import { ApiOperationOptions } from '@nestjs/swagger';
import { CursorBy, OrderBy } from '@src/libs/api/types/api.type';
import { BaseModel } from '@src/libs/db/base.schema';

export type ApiOperationOptionsWithSummary = Required<
  Pick<ApiOperationOptions, 'summary'>
> &
  ApiOperationOptions;

export type ApiOperator<M extends string> = {
  [key in Capitalize<M>]: (
    apiOperationOptions: ApiOperationOptionsWithSummary,
  ) => MethodDecorator;
};

export type ValueOf<T extends Record<string, any>> = T[keyof T];

export type ErrorMessage<T extends Record<string, string>> = Required<{
  [key in ValueOf<T>]: string;
}>;

export type PaginatedQueryParams = {
  limit: number;
  orderBy: OrderBy<Pick<BaseModel, 'id'>>;
  page: number;
  cursor: CursorBy<BaseModel, 'id'>;
};

export type Paginated<T> = [Array<T>, number];

export type SingleProperty<T> = {
  [K in keyof T]: { [P in K]: T[P] } & Partial<
    Record<Exclude<keyof T, K>, never>
  >;
}[keyof T];
