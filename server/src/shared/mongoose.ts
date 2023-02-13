import {
  ClientSession,
  Document,
  QueryOptions,
  SaveOptions,
  Schema,
} from "mongoose";

type DocumentSaveCallback<T> = (err: any, doc: T) => void;

interface ModelOptions {
  session?: ClientSession | null;
}

export interface BaseDocument extends Document {
  createdAt?: Date;
  updatedAt?: Date;
  _deleted?: boolean;

  softDelete(fn?: DocumentSaveCallback<this>): Promise<this>;

  softDelete(
    options?: SaveOptions,
    fn?: DocumentSaveCallback<this>
  ): Promise<this>;

  restore(fn?: DocumentSaveCallback<this>): Promise<this>;

  restore(
    options?: SaveOptions,
    fn?: DocumentSaveCallback<this>
  ): Promise<this>;
}

export function getBaseSchema<T extends BaseDocument>(options = {}): Schema<T> {
  return new Schema<T>(
    {
      createdAt: Date,
      updatedAt: Date,
    },
    {
      timestamps: true,
      ...options,
    }
  );
}

export interface FindOptions extends QueryOptions {
  sort?: Record<string, unknown> | string;
  limit?: number;
  skip?: number;
  maxscan?: number;
  batchSize?: number;
  comment?: string;
  snapshot?: boolean;
  hint?: Record<string, unknown>;
}

export type DeleteOptions = ModelOptions;

export interface UpdateOptions extends DeleteOptions {
  multi?: boolean;
  upsert?: boolean;
  setDefaultsOnInsert?: boolean;
  timestamps?: boolean;
  omitUndefined?: boolean;
  overwrite?: boolean;
  runValidators?: boolean;
  context?: string;
  multipleCastError?: boolean;
}

export interface FindAndDeleteOptions extends QueryOptions {
  sort?: Record<string, unknown> | string;
}

export interface FindAndUpdateOptions extends QueryOptions, UpdateOptions {
  new?: boolean;
  fields?: Record<string, unknown> | string;
  timestamps?: any;
}
