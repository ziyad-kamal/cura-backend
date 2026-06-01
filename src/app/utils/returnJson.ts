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
        ...(data !== null && data),
    };

    return res.status(code).json(resObject);
};

const returnError = (res: Response, msg: string = "", code: number, errors?: Result<ValidationError>): Response => {
    let errorArray: Record<string, string[]>[] = [];

    if (errors) {
        const groupedErrors = errors.array().reduce<Record<string, string[]>>((acc, err) => {
            if (err.type === "field") {
                if (!acc[err.path]) {
                    acc[err.path] = [];
                }
                acc[err.path].push(err.msg);
            }
            return acc;
        }, {});

        errorArray = Object.entries(groupedErrors).map(([path, messages]) => ({
            [path]: messages,
        }));
    }

    const resObject: Record<string, unknown> = {
        success: false,
        ...(msg !== "" && { msg }),
        ...(errorArray.length > 0 && { errors: errorArray }),
    };

    return res.status(code).json(resObject);
};

export { returnError, returnSuccess };
