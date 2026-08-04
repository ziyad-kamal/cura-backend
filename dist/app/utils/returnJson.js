const returnSuccess = (res, msg = "", code = 200, data = null) => {
    const resObject = Object.assign(Object.assign({ success: true }, (msg !== "" && { msg })), (data !== null && data));
    return res.status(code).json(resObject);
};
const returnError = (res, msg = "", code, errors) => {
    let errorObject = {};
    if (errors) {
        errorObject = errors.array().reduce((acc, err) => {
            if (err.type === "field") {
                if (!acc[err.path]) {
                    acc[err.path] = [];
                }
                acc[err.path].push(err.msg);
            }
            return acc;
        }, {});
    }
    const resObject = Object.assign(Object.assign({ success: false }, (msg !== "" && { msg })), (Object.keys(errorObject).length > 0 && { errors: errorObject }));
    return res.status(code).json(resObject);
};
export { returnError, returnSuccess };
//# sourceMappingURL=returnJson.js.map