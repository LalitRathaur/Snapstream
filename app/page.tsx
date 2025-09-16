"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import VideoGallery from "./components/VideoGallery";
import FileUpload from "./components/FileUpload";

export default function VideosPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { data: session } = useSession(); // ✅ Get session from NextAuth
  const router = useRouter();

  // Fetch videos on mount (works for everyone)
  useEffect(() => {
    const fetchVideos = async () => {
      const res = await fetch("/api/video");
      const data = await res.json();
      setVideos(data);
    };
    fetchVideos();
  }, []);

  // Handle successful upload
  const handleUploadSuccess = (res: any) => {
    setVideos((prev) => [res, ...prev]); // add new video to top
    setShowUploadModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-6 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          {/* Page Title */}
          <div className="text-center flex-1">
            <h1 className="inline-block text-3xl font-extrabold text-gray-900 tracking-tight px-5 py-2 bg-white rounded-xl shadow-md">
              🎥 Videos & Images
            </h1>
          </div>

          {/* Login / User */}
          <div className="ml-4">
            {session?.user ? (
              <div className="flex items-center gap-3">
                <span className="text-gray-700 font-medium">
                  Hi, {session.user.name || session.user.email}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => router.push("/login")}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
              >
                Login
              </button>
            )}
          </div>
        </div>

        {/* Upload Button - only if logged in */}
        {session?.user && (
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
            >
              ⬆️ Upload Video
            </button>
          </div>
        )}

        {/* Gallery - visible to everyone */}
        {videos.length > 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-5">
            <VideoGallery videos={videos} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-32 bg-white rounded-xl shadow-md">
            <p className="text-gray-500 text-sm">No videos found</p>
          </div>
        )}
      </div>

      {/* Upload Modal - only if logged in */}
      {showUploadModal && session?.user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Background overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowUploadModal(false)}
          ></div>

          {/* Modal box */}
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm max-h-[90vh] overflow-auto shadow-xl z-10">
            {/* Close Button */}
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-2xl font-bold"
            >
              ×
            </button>

            <h2 className="text-lg font-bold mb-4">Upload Video</h2>

            <FileUpload
              fileType="video"
              onProgress={(p) => console.log("Progress:", p)}
              onSuccess={handleUploadSuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
}
