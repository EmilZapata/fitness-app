import { RAPID_API_HOST, RAPID_API_KEY, RAPID_BASE_URL } from "@core/constants";
import {
  IAPIResponseError,
  IError,
  IRequestPayload,
  IRequestResponse,
} from "@core/toolbox/interfaces/api.interface";
import type { AxiosError, AxiosResponse } from "axios";
import axios from "axios";

const axiosConfig = axios.create({
  baseURL: RAPID_BASE_URL,
  timeout: 30000,
  headers: {
    "X-RapidAPI-Key": RAPID_API_KEY,
    "X-RapidAPI-Host": RAPID_API_HOST,
  },
});

// Variables para manejar el refresco de token concurrente
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export default async function apiCall<T, R>({
  url,
  method,
  body,
  signal,
  params,
}: IRequestPayload<T>): Promise<IRequestResponse<R>> {
  let response: R | null = null;
  let error: IError | null = null;
  let isCanceled: boolean | null = false;
  let isError: boolean | null = false;
  let message: string | undefined = "";
  try {
    let res: AxiosResponse | null = null;

    if (method === "GET")
      res = await axiosConfig.get(url, { signal, ...params });
    if (method === "POST")
      res = await axiosConfig.post(url, body, { signal, ...params });
    if (method === "PATCH")
      res = await axiosConfig.patch(url, body, { signal, ...params });
    if (method === "PUT")
      res = await axiosConfig.put(url, body, { signal, ...params });
    if (method === "DELETE")
      res = await axiosConfig.delete(url, { signal, ...params });

    const data = res?.data;
    response = data?.data ? data.data : data;
    message = data?.message || data?.data?.message || "";
  } catch (e) {
    const err = e as AxiosError<IAPIResponseError<null>>;

    if (err.code === "ERR_CANCELED") {
      isCanceled = true;
    } else {
      isError = true;
    }

    message = err.response?.data?.message;
    const errorApi = err.response?.data?.error;
    if (!message && !error) {
      error = {
        title: "Error de red",
        description:
          (err.cause as { message?: string })?.message ||
          "Ocurrio un error en la red",
        status: "error",
      };
    } else {
      error = {
        title: message || "Ocurrio un problema",
        description: errorApi || "Hubo un problema al hacer tu peticion.",
        status: "error",
      };
    }
  }

  return { response, error, isCanceled, isError, message };
}
