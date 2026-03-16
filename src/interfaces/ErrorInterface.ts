export interface ErrorInterface extends Error {
    statusCode?: number;
    code?: string;
}
