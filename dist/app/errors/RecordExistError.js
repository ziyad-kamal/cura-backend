class RecordExistError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 409;
    }
}
export default RecordExistError;
//# sourceMappingURL=RecordExistError.js.map