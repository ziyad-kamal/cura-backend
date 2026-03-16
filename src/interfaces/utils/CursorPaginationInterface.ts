interface QueryCondition {
    $lt?: Date | string;
    $gt?: Date | string;
}

type queryType = Record<string, QueryCondition>;

interface QueryResult<T> {
    sortField: string & keyof T;
    query: queryType;
}

interface CursorResult<T> {
    hasMore: boolean;
    nextCursor: string | null;
    results: T[];
}

export { CursorResult, QueryResult, queryType };
