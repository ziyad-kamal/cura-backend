import { getSignedFileUrl } from "./getSignedFileUrl.js";
export const resolveFiles = async (files, visibility) => {
    if (!(files === null || files === void 0 ? void 0 : files.length))
        return [];
    if (visibility === "public") {
        // return files
        //     .filter((file) => file.s3Key)
        //     .map((file) => ({
        //         ...file,
        //         url: `http://d25j70azqw5p5x.cloudfront.net/${file.s3Key.replace("public/", "")}`,
        //     }));
    }
    return Promise.all(files
        .filter((file) => file.s3Key)
        .map(async (file) => (Object.assign(Object.assign({}, file), { url: await getSignedFileUrl(file.s3Key) }))));
};
//# sourceMappingURL=resolveFiles.js.map