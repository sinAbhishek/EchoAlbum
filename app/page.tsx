"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import UploadForm from "../components/UploadForm";

interface ImageEntry {
  id: string;
  title: string;
  imageUrl: string;
  location: string;
  description: string;
}

const FIXED_USER_ID = "cJrMtgMxRmUKVk6FrEc6";

export default function Home() {
  const [images, setImages] = useState<ImageEntry[]>([]);
  const [showForm, setShowForm] = useState(false);

  const fetchImages = async () => {
    const albumRef = collection(db, "users", FIXED_USER_ID, "albums");
    const snapshot = await getDocs(albumRef);
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ImageEntry[];
    setImages(data);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Album</h1>

      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        {showForm ? "Close Upload Form" : "Upload New Image"}
      </button>

      {showForm && (
        <UploadForm fixedUserId={FIXED_USER_ID} onUploadSuccess={fetchImages} />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img) => (
          <div key={img.id} className="border p-2 rounded shadow">
            <img
              src={img.imageUrl}
              alt={img.title}
              className="w-full h-48 object-cover"
            />
            <h2 className="font-semibold">{img.title}</h2>
            <p className="text-sm text-gray-500">{img.location}</p>
            <p className="text-sm">{img.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
