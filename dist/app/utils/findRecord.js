import NotFoundError from '../errors/NotFoundError.js';
export const findRecord = async (model, filter, select = '') => {
    const record = await model.findOne(filter).select(select);
    if (!record) {
        throw new NotFoundError(`${model.modelName} not found`);
    }
    return record;
};
//# sourceMappingURL=findRecord.js.map