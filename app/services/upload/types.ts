export interface PresignedUrlResponse {
  uploadUrl: string;
  publicUrl: string;
  key:       string;
}

export interface PresignedUrlPayload {
  filename:    string;
  contentType: string;
}