export interface JwtInterface {
    accessTokenSecret: string | undefined;
    refreshTokenSecret: string | undefined;
    accessExpireTime: string | undefined;
    refreshExpireTime: string | undefined;
}
