"use client";

import React, { useState, useEffect } from "react";

interface MediaItem {
  _id: string;
  title?: string;
  description?: string;
  videoUrl: string; // can be .jpg/.png/.mp4
  createdAt: string;
}

export default function MediaGallery({ videos }: { videos: MediaItem[] }) {
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [thumbnails, setThumbnails] = useState<{ [key: string]: string }>({});

  const handleOpen = (item: MediaItem) => setSelectedItem(item);
  const handleClose = () => setSelectedItem(null);

  // 🔹 Generate thumbnail for video
  const generateThumbnail = (item: MediaItem) => {
    if (!item.videoUrl.endsWith(".mp4") || thumbnails[item._id]) return;

    const video = document.createElement("video");
    video.src = item.videoUrl;
    video.crossOrigin = "anonymous"; // safe for CORS-enabled servers
    video.currentTime = 1; // capture frame at 1 second

    video.addEventListener("loadeddata", () => {
      const canvas = document.createElement("canvas");
      canvas.width = 300;
      canvas.height = 200;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imgUrl = canvas.toDataURL("image/png");
        setThumbnails((prev) => ({ ...prev, [item._id]: imgUrl }));
      }
    });
  };

  // Generate thumbnails for all videos once
  useEffect(() => {
    videos.forEach((item) => generateThumbnail(item));
  }, [videos]);

  return (
    <div className="px-10 py-12 space-y-12 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
  {/* === Title === */}
  <h1 className="text-4xl font-extrabold text-gray-900 text-center tracking-tight drop-shadow-sm">
    🎥 Media Gallery
  </h1>

  {/* === Thumbnail Grid === */}
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-10">
    {videos.map((item) => {
      const isVideo = item.videoUrl.endsWith(".mp4");
      const thumbnail = isVideo
        ? thumbnails[item._id] || "/loading-thumb.png"
        : item.videoUrl;

      return (
        <div
          key={item._id}
          onClick={() => handleOpen(item)}
          className="cursor-pointer rounded-2xl overflow-hidden shadow-md bg-white hover:shadow-2xl transition transform hover:-translate-y-1 hover:scale-105 group flex flex-col"
        >
          {/* Thumbnail */}
          <div className="relative w-full h-44 bg-gray-100">
            <img
              src={thumbnail}
              alt={item.title || "thumbnail"}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            {isVideo && (
              <span className="absolute inset-0 flex items-center justify-center text-white text-4xl bg-black/40 rounded-lg">
                ▶
              </span>
            )}
          </div>

          {/* Name & Role-like label */}
          <div className="p-4 text-center bg-gray-50">
            <p className="text-sm font-semibold text-gray-800 truncate">
              {item.title || item.videoUrl.split("/").pop()}
            </p>
            <span className="inline-block mt-2 text-xs px-2 py-1 bg-blue-100 text-blue-600 font-medium rounded-full">
              {isVideo ? "🎬 Video" : "🖼️ Image"}
            </span>
          </div>
        </div>
      );
    })}
  </div>

  {/* === Preview Modal === */}
  {selectedItem && (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full relative overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800 truncate">
            {selectedItem.title || selectedItem.videoUrl.split("/").pop()}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-red-500 text-2xl transition"
          >
            ✖
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center bg-gradient-to-br from-white to-gray-50">
          {selectedItem.videoUrl.endsWith(".mp4") ? (
            <video
              src={selectedItem.videoUrl}
              controls
              autoPlay
              className="w-full max-h-[75vh] rounded-xl shadow-lg"
              poster={thumbnails[selectedItem._id]}
            />
          ) : (
            <img
              src={selectedItem.videoUrl}
              alt={selectedItem.title}
              className="w-full max-h-[75vh] object-contain rounded-xl shadow-lg"
            />
          )}

          {selectedItem.description && (
            <p className="mt-4 text-sm text-gray-600 text-center max-w-2xl">
              {selectedItem.description}
            </p>
          )}
          <p className="mt-2 text-xs text-gray-400">
            Uploaded: {new Date(selectedItem.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )}
</div>

  );
}
