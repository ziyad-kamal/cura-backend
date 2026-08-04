class UnknownError extends Error {
    constructor() {
        super('something went wrong');
        this.statusCode = 500;
    }
}
export default UnknownError;
//# sourceMappingURL=UnknownError.js.map