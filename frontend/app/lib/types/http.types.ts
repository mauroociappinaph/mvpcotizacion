// Tipos para httplazy

export interface HttpConfig {
  headers?: Record<string, string>;
  params?: Record<string, string>;
  timeout?: number;
  baseURL?: string;
  [key: string]: unknown;
}

export interface HttpResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: HttpConfig;
}

export interface HttpError {
  status: number;
  message: string;
  response?: HttpResponse<unknown>;
  config?: HttpConfig;
}
