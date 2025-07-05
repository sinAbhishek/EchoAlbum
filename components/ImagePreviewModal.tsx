"use client";

import { Dialog } from "@headlessui/react";

interface ImagePreviewModalProps {
  image: ImageEntry | null;
  onClose: () => void;
}
interface ImageEntry {
  id: string;
  title: string;
  imageUrl: string;
  location: string;
  description: string;
  createdAt: Object;
}

export default function ImagePreviewModal({
  image,
  onClose,
}: ImagePreviewModalProps) {
  if (!image) return null;

  return (
    <Dialog open={!!image} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 space-y-4"
        >
          <img
            src={image.imageUrl}
            alt={image.title}
            className="w-full max-h-[70vh] object-contain rounded-lg"
          />
          <div>
            <h2 className="text-xl font-semibold">{image.title}</h2>
            {image.location && (
              <p className="text-sm text-gray-600">📍 {image.location}</p>
            )}
            {image.description && (
              <p className="mt-2 text-gray-800">{image.description}</p>
            )}
          </div>

          <div className="text-right">
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-pink-400 text-white rounded hover:bg-pink-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
