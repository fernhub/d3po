import { api } from ".";

/**
 * Securly upload a file to s3
 * @param file
 */
async function uploadFileToS3(file: File) {
  if (file === undefined) {
    throw new Error("File not defined, cannot upload");
  }
  const { presignedUrl } = await api.getPresignedPutUrl(file);
  uploadFileToS3PresignedUrl(file, presignedUrl);
}

/**
 * Securely upload a file to s3 after you've already generated a presigned put url with limited ttl
 * @param file
 * @param presignedPutUrl
 */
async function uploadFileToS3PresignedUrl(file: File, presignedPutUrl: string) {
  const res = await fetch(presignedPutUrl, {
    method: "PUT",
    body: file,
  });
  api.checkResponseAndThrowError(res);
  const createFileResponse = await fetch("http://localhost:5001/documents/createDocumentPointer", {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      name: file.name,
    }),
  });
  api.checkResponseAndThrowError(createFileResponse);
  alert("SUCCESS");
}

export const fileUploadUtils = {
  uploadFileToS3,
};
