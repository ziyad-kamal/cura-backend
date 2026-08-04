import { redis } from '../../config/redis.js';
import CustomError from '../errors/CustomError.js';
import UnknownError from '../errors/UnknownError.js';
export const verifyToken = async (email, token, name) => {
    const cachedToken = await redis.get(`${name + email}`);
    if (!cachedToken) {
        throw new CustomError("link is expired", 410);
    }
    if (token !== cachedToken) {
        throw new UnknownError();
    }
};
//# sourceMappingURL=verifyToken.js.map