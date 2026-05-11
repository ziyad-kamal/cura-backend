export type PaginationType<T, K extends string = "data"> = {
    metadata: {
        hasMore: boolean;
        nextCursor: string | null;
    };
} & {
    // eslint-disable-next-line no-unused-vars
    [key in K]: T[];
};
