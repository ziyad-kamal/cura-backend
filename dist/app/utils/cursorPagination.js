const getQueryCursor = (req, sortField) => {
    const cursor = req.query.cursor;
    const query = {};
    if (cursor) {
        query[sortField] = { $lt: new Date(cursor) };
    }
    return { sortField, query };
};
const getNextCursor = (data, limit, sortField) => {
    const hasMore = data.length > limit;
    const results = hasMore ? data.slice(0, limit) : data;
    const lastRecord = results[results.length - 1];
    const nextCursor = hasMore && lastRecord
        ? String(lastRecord[sortField] instanceof Date
            ? lastRecord[sortField].toISOString()
            : lastRecord[sortField])
        : null;
    return { hasMore, nextCursor, results };
};
export { getNextCursor, getQueryCursor };
//# sourceMappingURL=cursorPagination.js.map