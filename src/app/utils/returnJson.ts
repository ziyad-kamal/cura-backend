import { Response } from "express";
import { Result, ValidationError } from "express-validator";

const returnSuccess = <T>(
    res: Response,
    msg: string = "",
    code: number = 200,
    data: T | T[] | null = null,
): Response => {
    const resObject: Record<string, unknown> = {
        success: true,
        ...(msg !== "" && { msg }),
        ...(data !== null && { data }),
    };

    return res.status(code).json(resObject);
};

const returnError = (
    res: Response,
    msg: string = "",
    code: number,
    errors?: Result<ValidationError>,
): Response => {
    let errorArray: Array<Record<string, string>> = [];

    // Only process errors if they were provided
    if (errors) {
        const firstErrors = errors
            .array()
            .reduce<Record<string, string>>((acc, err) => {
                if (err.type === "field" && !(err.path in acc)) {
                    acc[err.path] = err.msg;
                }
                return acc;
            }, {});

        errorArray = Object.entries(firstErrors).map(([path, message]) => ({
            [path]: message,
        }));
    }

    const resObject: Record<string, unknown> = {
        success: false,
        ...(msg === "" && { msg }),
        ...(errorArray.length > 0 && { errors: errorArray }),
    };

    return res.status(code).json(resObject);
};

export { returnError, returnSuccess };
