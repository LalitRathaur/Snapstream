"use client";

import {
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import React, { useState } from "react";

interface FileUploadProps {
  onSuccess?: (res: any) => void;
  onProgress?: (progress: number) => void;
  fileType?: "image" | "video";
}

const FileUpload: React.FC<FileUploadProps> = ({ onSuccess, onProgress, fileType }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const validateFile = (file: File) => {
    if (fileType === "video" && !file.type.startsWith("video/")) {
      setError("Please upload a valid video file");
      return false;
    }
    if (fileType === "image" && !file.type.startsWith("image/")) {
      setError("Please upload a valid image file");
      return false;
    }
    if (file.size > 100 * 1024 * 1024) {
      setError("File size must be less than 100 MB");
      return false;
    }
    setError(null);
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    if (!validateFile(selectedFile)) return;
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      // Fetch auth params from your API
      const authRes = await fetch("/api/auth/imagekit-auth");
      const auth = await authRes.json();

      const res = await upload({
        file,
        fileName: file.name,
        publicKey: auth.publicKey,
        signature: auth.authenticationParameters.signature,
        expire: auth.authenticationParameters.expire,
        token: auth.authenticationParameters.token,
        });
       const isVideo = file.type.startsWith("video/");
       const saveRes = await fetch("/api/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: file.name,
          description: "Uploaded via FileUpload component",
          videoUrl: res.url,
          thumbnailUrl: isVideo
            ? `${res.url}/ik-thumbnail.jpg?tr=w-300,h-200`
            : `${res.url}?tr=w-300,h-200,cm-extract`,
        }),
      });

      if (!saveRes.ok) throw new Error("Failed to save video metadata");
      console.log("✅ Video saved in DB:", await saveRes.json());
      if(onSuccess){
       onSuccess(res);
      }
      setFile(null); // clear after success
    } catch (err) {
      if (err instanceof ImageKitUploadNetworkError) {
        setError("Network error while uploading");
      } else if (err instanceof ImageKitInvalidRequestError) {
        setError("Invalid request");
      } else if (err instanceof ImageKitServerError) {
        setError("Server error, please try again");
      } else {
        setError("Unknown error occurred");
      }
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
  <div className="w-full max-w-xl bg-white p-8 rounded-lg shadow-lg">
    <label className="block text-lg font-semibold text-gray-800 mb-4">
      {fileType === "video" ? "Upload a Video" : "Upload an Image"}
    </label>

    <input
      type="file"
      accept={fileType === "video" ? "video/*" : "image/*"}
      onChange={handleFileChange}
      className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4
                 file:rounded-md file:border-0
                 file:text-sm file:font-semibold
                 file:bg-blue-600 file:text-white
                 hover:file:bg-blue-700 transition duration-200"
    />

    {file && !uploading && (
      <button
        onClick={handleUpload}
        className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
      >
        Upload
      </button>
    )}

    {uploading && (
      <div className="mt-4 text-sm text-gray-600">
        <span className="animate-pulse">Uploading...</span>
      </div>
    )}

    {error && (
      <p className="mt-3 text-sm text-red-600">
        {error}
      </p>
    )}
  </div>
</div>


  );
};

export default FileUpload;
