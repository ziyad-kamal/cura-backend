import { getSignedFileUrl } from "./getSignedFileUrl.js";

export const resolveFiles = async <T extends { s3Key: string }>(
    files: T[] | undefined,
    visibility: string,
): Promise<(T & { url: string })[]> => {
    if (!files?.length) return [];

    if (visibility === "public") {
        // return files
        //     .filter((file) => file.s3Key)
        //     .map((file) => ({
        //         ...file,
        //         url: `http://d25j70azqw5p5x.cloudfront.net/${file.s3Key.replace("public/", "")}`,
        //     }));
    }

    return Promise.all(
        files
            .filter((file) => file.s3Key)
            .map(async (file) => ({
                ...file,
                url: await getSignedFileUrl(file.s3Key),
            })),
    );
};
