import { Request } from "express";
import { CursorResult, QueryResult, queryType } from "../../interfaces/utils/CursorPaginationType.ts";

const getQueryCursor = <T>(req: Request, sortField: string & keyof T): QueryResult<T> => {
    const cursor = req.query.cursor as string | null;
    const query: queryType = {};

    if (cursor) {
        query[sortField] = { $lt: new Date(cursor) };
    }

    return { sortField, query };
};

const getNextCursor = <T>(data: T[], limit: number, sortField: string & keyof T): CursorResult<T> => {
    const hasMore = data.length > limit;
    const results = hasMore ? data.slice(0, limit) : data;

    const lastRecord = results[results.length - 1];
    const nextCursor =
        hasMore && lastRecord
            ? String(
                  lastRecord[sortField] instanceof Date
                      ? (lastRecord[sortField] as Date).toISOString()
                      : lastRecord[sortField],
              )
            : null;

    return { hasMore, nextCursor, results };
};
export { getNextCursor, getQueryCursor };
