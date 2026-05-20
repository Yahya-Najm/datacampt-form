export type UploadFolder = "photos" | "pdfs" | "documents";

export async function uploadToR2(file: File, folder: UploadFolder): Promise<string> {
  const res = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contentType: file.type,
      fileSizeBytes: file.size,
      folder,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? "Failed to get upload URL");
  }

  const { uploadUrl, publicUrl } = await res.json();

  const upload = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  });

  if (!upload.ok) throw new Error("Failed to upload file to storage");

  return publicUrl as string;
}
