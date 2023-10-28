export interface ResponseErrorItem {
  message: string;
  field?: string;
}

export interface ResponseError {
  errors: ResponseErrorItem[];
}
