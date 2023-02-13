import * as express from "express";

import { IPagination, IPaginationHeader } from "./pagination.header.interface";

export const createPagination = (
  page: number,
  perPage: number
): IPagination => {
  page = +page || 1;
  perPage = +perPage || 20;

  const startIndex = (page - 1) * perPage;
  const endIndex = page * perPage;

  return {
    page,
    perPage,
    startIndex,
    endIndex,
  };
};

export function setPaginationResponseHeader(
  res: express.Response,
  pagedObjects: any
): any {
  for (const key in pagedObjects.headers) {
    if (pagedObjects.headers.hasOwnProperty(key)) {
      res.append(key, pagedObjects.headers[key]);
    }
  }
  const {headers, ...body} = pagedObjects;
  return res.json(body);
}

export function getHeaders(pagination: IPagination, totalCount: number): IPaginationHeader {
  const page = Number(pagination.page);
  const perPage = Number(pagination.perPage);
  const pagesCount = Math.ceil(totalCount / perPage);

  return {
    'x-page': page,
    'x-total-count': totalCount,
    'x-pages-count': pagesCount,
    'x-per-page': perPage,
    'x-next-page': page === pagesCount ? page : page + 1,
  };
}

export function getHeadersWithoutCount(pagination: IPagination): IPaginationHeader {
  const page = Number(pagination.page);
  const perPage = Number(pagination.perPage);

  return {
    'x-page': page,
    'x-per-page': perPage,
    'x-next-page': page + 1,
  };
}
