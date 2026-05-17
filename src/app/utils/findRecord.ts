import { HydratedDocument, Model } from "mongoose";
import NotFoundError from '../errors/NotFoundError.js';

export const findRecord = async <T>(model: Model<T>, filter: object,select:string=''): Promise<HydratedDocument<T>> => {
    const record = await model.findOne(filter).select(select);

    if (!record) {
        throw new NotFoundError(`${model.modelName} not found`);
    }

    return record;
};