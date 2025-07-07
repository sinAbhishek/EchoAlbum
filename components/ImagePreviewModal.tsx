"use client";

import { Dialog } from "@headlessui/react";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebase";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { MapPin, X, Trash } from 'lucide-react';

interface ImagePreviewModalProps {
  image: ImageEntry | null;
  onClose: () => void;
  onDeleted: () => void;
}

interface ImageEntry {
  id: string;
  title: string;
  imageUrl: string;
  location: string;
  description: string;
  createdAt: object;
}

export default function ImagePreviewModal({
  image,
  onClose,
  onDeleted,
}: ImagePreviewModalProps) {
  const { user } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!image) return null;

  const handleDelete = async () => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "albums", image.id));
      setConfirmOpen(false);
      onClose();
      onDeleted();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete image.");
    }
  };

  return (
    <>
      <Dialog open={!!image} onClose={onClose} className="relative z-50">
        <div className="fixed inset-0 bg-black/50" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div
            role="dialog"
            aria-modal="true"
            className="bg-white relative rounded-lg shadow-xl max-w-2xl w-full p-6 space-y-4"
          >
            <div className="relative">
              <img
                src={image.imageUrl}
                alt={image.title}
                className="w-full max-h-[70vh] object-contain rounded-lg"
              />

              <div className="absolute bottom-0 left-0 bg-gray-900 px-2 py-1 rounded-md flex items-center justify-between">
                <MapPin size={".8rem"} />
                {image.location && (<p className="text-xs text-gray-200 ml-2  ">  {image.location}</p>)}
              </div>
            </div>


            <div>
              <div className=" w-full flex items-center justify-center">
                <h2 className="text-2xl patrick font-semibold text-gray-950">{image.title}</h2>
              </div>


              {image.description && (
                <p className="mt-2 text-gray-800">{image.description}</p>
              )}
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setConfirmOpen(true)}
                className="bg-gray-100 hover:cursor-pointer text-blue-800 border border-blue-500 px-4 py-2 rounded hover:bg-blue-600 hover:text-white gap-2 flex items-center"
              >
                <Trash size={"1rem"} /> Delete
              </button>

            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 text-black rounded bg-gray-100  absolute top-0 right-0 hover:cursor-pointer"
            >
              <X />
            </button>
          </div>

        </div>
      </Dialog>

      {/* Confirm Delete Modal */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded shadow-lg space-y-4 max-w-sm w-full">
            <p className="text-lg font-medium text-center text-black">
              Are you sure you want to delete this image?
            </p>
            <div className="flex justify-between">
              <button
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
