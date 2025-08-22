"use client";

import React, { useState } from "react";
import FileUpload from "./components/FileUpload";

export default function HomePage() {
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Upload File</h1>

      <FileUpload
        fileType="image"
        onProgress={(p) => console.log("Progress:", p)}
        onSuccess={(res) => {
          console.log("Upload success:", res);
          setUploadedUrl(res.url); // Save the uploaded file URL
        }}
      />

      {uploadedUrl && (
        <div className="mt-4">
          <p>Uploaded Successfully 🎉</p>
          <img src={uploadedUrl} alt="Uploaded file" className="w-64 h-auto" />
        </div>
      )}
    </div>
  );
}