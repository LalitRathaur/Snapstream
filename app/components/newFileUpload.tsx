"use client";

import React, { useState } from "react";
import { upload } from "@imagekit/next";

const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // 1️⃣ Get auth params
      const res = await fetch("/api/auth/imagekit-auth");
      if (!res.ok) throw new Error("Failed to get auth params");
      const auth = await res.json();

      // 2️⃣ Upload file to ImageKit
      const result = await upload({
        file,
        fileName: file.name,
        publicKey: auth.publicKey,
        signature: auth.authenticationParameters.signature,
        expire: auth.authenticationParameters.expire,
        token: auth.authenticationParameters.token,
      });

      console.log("Uploaded to ImageKit:", result);

      // 3️⃣ Save metadata to your DB
      const saveRes = await fetch("/api/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: result.url,
          fileId: result.fileId,
          name: result.name,
        }),
      });

      if (!saveRes.ok) throw new Error("Failed to save video metadata");

      alert("Video uploaded & saved successfully!");
    } catch (err: any) {
      console.error("Upload failed:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded">
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="ml-2 px-4 py-2 bg-blue-600 text-white rounded"
      >
        {uploading ? "Uploading..." : "Upload Video"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default FileUpload;
