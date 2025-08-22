"use client";
import { useEffect, useState } from "react";
import VideoGallery from "../components/VideoGallery";

export default function VideosPage() {
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await fetch("/api/video");
      const data = await res.json();
      setVideos(data);
    };
    fetchVideos();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-6 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Page Title */}
        <div className="text-center mb-10">
          <h1 className="inline-block text-3xl font-extrabold text-gray-900 tracking-tight px-5 py-2 bg-white rounded-xl shadow-md">
            🎥 Videos & Images
          </h1>
          <p className="mt-2 text-gray-500 text-sm">
            Browse your uploaded media below
          </p>
        </div>

        {/* Gallery */}
        {videos.length > 0 ? (
          <div className="bg-white rounded-4x1 shadow-lg p-5">
            <VideoGallery videos={videos} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-32 bg-white rounded-xl shadow-md">
            <p className="text-gray-500 text-sm">No videos found</p>
          </div>
        )}
      </div>
    </div>
  );
}
