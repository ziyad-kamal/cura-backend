export type PaginatedInterface<T, K extends string = "data"> = {
    metaData: {
        hasMore: boolean;
        nextCursor: string | null;
    };
} & {
    // eslint-disable-next-line no-unused-vars
    [key in K]: T[];
};
