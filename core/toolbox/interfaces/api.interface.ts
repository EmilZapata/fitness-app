import { AxiosRequestConfig } from "axios";

export interface IAPIResponseError<T> {
  error?: string;
  statusCode: number;
  message: string;
  response: T;
}

export interface IRequestPayload<T> {
  url: string;
  method: IMethod;
  body?: T;
  customToken?: string;
  noTimeout?: boolean;
  signal?: AbortSignal;
  params?: AxiosRequestConfig;
}

export interface IError {
  title: string;
  description: string;
  status: string;
}

export interface IRequestResponse<T> {
  response: T | null;
  message?: string;
  error: IError | null;
  isCanceled: boolean | null;
  isError: boolean | null;
}

// type ID = number | string;

export type IMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
