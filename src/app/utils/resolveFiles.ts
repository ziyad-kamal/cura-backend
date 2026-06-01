import { getSignedFileUrl } from "./getSignedFileUrl.js";

export const resolveFiles = async (files: { s3Key: string;}[] | undefined, visibility: string) => {
    if (!files?.length) return [];

    if (visibility === "public") {
        return files.filter((file) => file.s3Key)
        .map((file) => {
            const s3Key = file.s3Key.replace("public/", "");

            return {
                ...file,
                url: `http://d25j70azqw5p5x.cloudfront.net/${s3Key}`,
            };
        });
    }

    // Private — generate presigned URLs
    return await Promise.all(
        files
            .filter((file) => file.s3Key)
            .map(async (file) => ({
                ...file,
                url: await getSignedFileUrl(file.s3Key),
            })),
    );
};
