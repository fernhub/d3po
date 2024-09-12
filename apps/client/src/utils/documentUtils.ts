import { DOCUMENT_STATUS } from "shared/enums/document";
import { api, API_URL } from ".";
import { type DocumentSignedUrl, type Document } from "shared/schema/document";

export const documentApi = {
  uploadNewFile: async function (file: File) {
    const beingUpload = await beginDocumentUpload(file);
    console.log("uploaded");
    await uploadFileToS3PresignedUrl(file, beingUpload.presignedUrl);
    console.log("uplaoded to s3");
    await markUploadComplete(beingUpload.s3_key);
    console.log("updated status in db");
  },
  getAll: async function (): Promise<Document[]> {
    const res = await fetch(`${API_URL}/documents/`, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });
    return await api.checkResponseAndThrowError(res);
  },
  deleteFile: async function (s3_key: string) {
    console.log("deleting");
    const res = await fetch(`${API_URL}/documents/`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        s3_key: s3_key,
      }),
    });
    if (!res.ok) {
      //TODO: gotta mark our document in db as error
      throw Error("Error posting to s3");
    }
  },
};

async function getPresignedPutUrl(file: File): Promise<DocumentSignedUrl> {
  if (file.size > 5000000) {
    throw new Error("File too large, 5MB upload limit");
  }
  console.log("sending request");
  const res = await fetch(`${API_URL}/documents/beginUpload`, {
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
  return await api.checkResponseAndThrowError(res);
}

/**
 * Begin document upload.
 * Sends file to db, which creates a row for 'processing', and generates presigned url for sending to s3
 * @param file
 */
async function beginDocumentUpload(file: File): Promise<DocumentSignedUrl> {
  return await getPresignedPutUrl(file);
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
  if (!res.ok) {
    //TODO: gotta mark our document in db as error
    throw Error("Error posting to s3");
  }
}

/**
 * Mark an upload as successful
 * @param s3_key
 * @returns
 */
async function markUploadComplete(s3_key: string) {
  console.log("updating");
  if (s3_key === undefined || s3_key === null || s3_key === "") {
    throw new Error("File not defined, cannot upload");
  }
  const res = await fetch(`${API_URL}/documents/updateDocument`, {
    method: "PUT",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      s3_key: s3_key,
      status: DOCUMENT_STATUS.UPLOADED,
    }),
  });
  return await api.checkResponseAndThrowError(res);
}
