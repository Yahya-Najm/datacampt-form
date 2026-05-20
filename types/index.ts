export type UploadFolder = "photos" | "pdfs" | "documents";

export interface PresignedUploadRequest {
  contentType: string;
  fileSizeBytes: number;
  folder: UploadFolder;
}

export interface PresignedUploadResponse {
  uploadUrl: string;
  fileKey: string;
  publicUrl: string;
}
