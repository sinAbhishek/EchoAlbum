"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase";
import { Upload, HardDriveUpload } from 'lucide-react';
interface UploadFormProps {
  fixedUserId: string;
  onUploadSuccess: () => void;
  onClose: () => void; // ← NEW: for manually closing modal
}


export default function UploadForm({
  fixedUserId,
  onUploadSuccess,
  onClose,
}: UploadFormProps) {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("")
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
      onClose();
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} className="space-y-3 mb-6">
      <div className=" redhat">
        <p className=" text-gray-900 text-sm">Title</p>
        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 border text-gray-800 border-gray-300 rounded outline-none mt-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>



      <div className=" redhat">
        <p className=" text-gray-900 text-sm">Location</p>
        <input
          type="text"
          placeholder="Location"
          className="w-full p-2 border text-gray-800 border-gray-300 rounded outline-none mt-1 "
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      <div className=" redhat">
        <p className=" text-gray-900 text-sm">Description</p>
        <textarea
          placeholder="Description"
          className="w-full p-2 border text-gray-800 border-gray-300 rounded outline-none mt-1"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>
      <div className=" redhat">
        <p className=" text-gray-900 text-sm">Upload Image</p>
        <input
          type="file"
          accept="image/*"
          id="img"
          className="w-full text-gray-800 hidden"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          required

        />
        <div className=" mt-1">
          <label
            className=" bg-teal-400 px-2 rounded-md  py-2 flex gap-2 items-center w-1/2 my-2"
            htmlFor="img"
          >
            <Upload />
            {imageFile?.name.substring(0, 15)}
            {!imageFile && <p className=" text-white redhat font-semibold">Choose Image</p>}
          </label>
        </div>
      </div>
      <div className="flex justify-between mt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 h-max bg-rose-500 text-white rounded hover:cursor-pointer redhat"
        >
          Cancel
        </button>
        <div className=" flex flex-col items-center justify-center">
          <button
            type="submit"
            disabled={uploading}
            className="bg-blue-800 text-white px-4 py-2 rounded hover:cursor-pointer"
          >
            {uploading ? "Uploading..." : <p className=" flex items-center justify-center redhat gap-2"><HardDriveUpload size={"1rem"} /> <span className="redhat">Upload</span></p>}
          </button>
          {uploading && (
            <div className="flex justify-center items-center mt-2">
              <div className="w-6 h-6 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

      </div>
    </form>
  );
}
