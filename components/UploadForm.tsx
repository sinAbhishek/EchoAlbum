"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase";

interface UploadFormProps {
  fixedUserId: string;
  onUploadSuccess: () => void;
  onClose: () => void; // ← NEW: for manually closing modal
}
const cloud_name: string = "dxz1nwfam";
const upload_preset = "dfpytcaw";

export default function UploadForm({
  fixedUserId,
  onUploadSuccess,
  onClose,
}: UploadFormProps) {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageFile) {
      alert("Title and Image are required");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", "dfpytcaw");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/dxz1nwfam/image/upload`,
        { method: "POST", body: formData }
      );

      const data = await res.json();
      if (!data.secure_url) throw new Error("Cloudinary upload failed");

      await addDoc(collection(db, "users", fixedUserId, "albums"), {
        title,
        imageUrl: data.secure_url,
        location,
        description,
        createdAt: serverTimestamp(),
      });

      setTitle("");
      setLocation("");
      setDescription("");
      setImageFile(null);

      onUploadSuccess();
      onClose(); // ← CLOSE modal after success
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} className="space-y-3 mb-6">
      <input
        type="text"
        placeholder="Title"
        className="w-full p-2 border rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <input
        type="file"
        accept="image/*"
        className="w-full"
        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        required
      />

      <input
        type="text"
        placeholder="Location"
        className="w-full p-2 border rounded"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <textarea
        placeholder="Description"
        className="w-full p-2 border rounded"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onClose} // ← closes modal
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={uploading}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </form>
  );
}
