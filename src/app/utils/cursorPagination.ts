import { Request } from "express";
import {
    CursorResult,
    QueryResult,
    queryType,
} from "../../interfaces/utils/CursorPaginationInterface.ts";

const getQueryCursor = <T>(
    req: Request,
    sortField: string & keyof T,
): QueryResult<T> => {
    const cursor = req.query.cursor as string | undefined;
    const query: queryType = {};

    if (cursor) {
        query[sortField] = { $lt: new Date(cursor) };
    }

    return { sortField, query };
};

const getNextCursor = <T>(
    posts: T[],
    limit: number,
    sortField: string & keyof T,
): CursorResult<T> => {
    const hasMore = posts.length > limit;
    const results = hasMore ? posts.slice(0, limit) : posts;

    const lastPost = results[results.length - 1];
    const nextCursor =
        hasMore && lastPost
            ? String(
                  lastPost[sortField] instanceof Date
                      ? (lastPost[sortField] as Date).toISOString()
                      : lastPost[sortField],
              )
            : null;

    return { hasMore, nextCursor, results };
};
export { getNextCursor, getQueryCursor };
