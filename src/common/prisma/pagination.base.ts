import { PaginationDto } from '../base/pagination.dto';

export const getPagination = (dto?: PaginationDto) => {
  return {
    take: dto?.count,
    skip: dto?.page ? (dto.page - 1) * dto.count : undefined,
  };
};
