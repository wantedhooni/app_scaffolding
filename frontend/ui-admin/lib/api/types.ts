export type PageResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
};

export type DeleteResponse = {
  id: string;
  deleted: boolean;
  message: string;
};
