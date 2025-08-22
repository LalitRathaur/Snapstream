"use client";

import React, { useEffect, useState } from "react";

interface Media {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;       // can be image or video
  thumbnailUrl?: string;
  createdAt: string;
}

export default function GettingFile() {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await fetch("/api/video");
        if (!res.ok) throw new Error("Failed to fetch media");
        const data = await res.json();
        setMedia(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMedia();
  }, []);

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {media.map((item) => {
        // check extension
        const ext = item.videoUrl.split(".").pop()?.toLowerCase();
        const isVideo = ["mp4", "webm", "ogg", "mov"].includes(ext || "");

        return (
          <div
            key={item._id}
            className="border rounded-lg p-4 shadow-sm bg-white"
          >
            <h3 className="font-semibold mb-2">{item.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{item.description}</p>

            {isVideo ? (
              <video
                src={item.videoUrl}
                controls
                className="w-full rounded-md"
                poster={item.thumbnailUrl}
              />
            ) : (
              <img
                src={item.videoUrl}
                alt={item.title}
                className="w-full rounded-md"
              />
            )}

            <p className="text-xs text-gray-400 mt-2">
              Uploaded: {new Date(item.createdAt).toLocaleString()}
            </p>
          </div>
        );
      })}
    </div>
  );
}
