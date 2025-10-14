import * as React from 'react';

interface UploadInputFile {
  file: File | Blob;
}

interface UploadInputUrl {
  url: string;
}

interface UploadInputBase64 {
  base64: string;
}

interface UploadInputBuffer {
  buffer: ArrayBuffer;
}

type UploadInput = UploadInputFile | UploadInputUrl | UploadInputBase64 | UploadInputBuffer;

interface UploadResult {
  url?: string;
  mimeType?: string | null;
  error?: string;
}

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000/v1';

function useUpload() {
  const [loading, setLoading] = React.useState(false);
  
  const upload = React.useCallback(async (input: UploadInput): Promise<UploadResult> => {
    try {
      setLoading(true);
      let response: Response;
      
      if ("file" in input && input.file) {
        const formData = new FormData();
        formData.append("file", input.file);
        response = await fetch(`${API_BASE_URL}/upload`, {
          method: "POST",
          body: formData
        });
      } else if ("url" in input) {
        response = await fetch(`${API_BASE_URL}/upload`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ url: input.url })
        });
      } else if ("base64" in input) {
        response = await fetch(`${API_BASE_URL}/upload`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ base64: input.base64 })
        });
      } else {
        response = await fetch(`${API_BASE_URL}/upload`, {
          method: "POST",
          headers: {
            "Content-Type": "application/octet-stream"
          },
          body: input.buffer
        });
      }
      
      if (!response.ok) {
        if (response.status === 413) {
          throw new Error("Upload failed: File too large.");
        }
        throw new Error("Upload failed");
      }
      
      const data = await response.json();
      return { url: data.url, mimeType: data.mimeType || null };
    } catch (uploadError) {
      if (uploadError instanceof Error) {
        return { error: uploadError.message };
      }
      if (typeof uploadError === "string") {
        return { error: uploadError };
      }
      return { error: "Upload failed" };
    } finally {
      setLoading(false);
    }
  }, []);

  return [upload, { loading }] as const;
}

export { useUpload };
export default useUpload;
