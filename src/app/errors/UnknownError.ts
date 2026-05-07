class UnknownError extends Error {
    statusCode: number;

    constructor() {
        super('something went wrong');
        this.statusCode = 500;
    }
}

export default UnknownError;
