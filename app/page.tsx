"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import UploadForm from "@/components/UploadForm";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog } from "@headlessui/react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import ImagePreviewModal from "@/components/ImagePreviewModal";

interface ImageEntry {
  id: string;
  title: string;
  imageUrl: string;
  location: string;
  description: string;
  createdAt: Object;
}

const tiltClasses = [
  "rotate-[-3deg]",
  "rotate-[2deg]",
  "rotate-[-2deg]",
  "rotate-[3deg]",
  "rotate-[1deg]",
  "rotate-[-1deg]",
  "rotate-[4deg]",
  "rotate-[-4deg]",
  "rotate-[2.5deg]",
];

export default function Home() {
  const [images, setImages] = useState<ImageEntry[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageEntry | null>(null);
  const [page, setPage] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const imagesPerPage = 9;

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user]);

  useEffect(() => {
    if (user) fetchImages();
  }, [user]);

  const fetchImages = async () => {
    const albumRef = collection(db, "users", user!.uid, "albums");
    const snapshot = await getDocs(albumRef);
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ImageEntry[];
    setImages(data);
  };

  const paginatedImages = images.slice(
    page * imagesPerPage,
    (page + 1) * imagesPerPage
  );

  return (
    <div className="font-patrick h-screen bg-gray-100 flex flex-col overflow-hidden">
      {!user ? (
        <div className="flex justify-center items-center h-full text-xl">
          Loading...
        </div>
      ) : (
        <>
          {/* Fixed Top Title Bar */}
          <div className="fixed top-0 left-0 w-full z-10 py-4 text-center shadow-sm bg-gray-100">
            <h1 className="text-2xl">📸 Moments with Blep</h1>
          </div>

          {/* Prev Button - Left Side */}
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="fixed left-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-pink-300 rounded disabled:opacity-50 text-sm z-20 shadow"
          >
            <ChevronLeft />
          </button>

          {/* Next Button - Right Side */}
          <button
            disabled={(page + 1) * imagesPerPage >= images.length}
            onClick={() => setPage((p) => p + 1)}
            className="fixed right-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-pink-300 rounded disabled:opacity-50 text-sm z-20 shadow"
          >
            <ChevronRight />
          </button>

          {/* Scrollable Image Grid */}
          <div className="flex-1 overflow-y-auto hide-scrollbar pt-20 pb-24 px-4 w-[95%] max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
            {paginatedImages.map((img, idx) => (
              <div
                key={img.id}
                onClick={() => setSelectedImage(img)}
                className={`bg-white shadow-xl h-max rounded-xl p-3 w-[200px] hover:scale-110 transition ease-in-out duration-200 delay-100 hover:cursor-pointer ${tiltClasses[idx % tiltClasses.length]
                  }`}
              >
                <img
                  src={img.imageUrl}
                  alt={img.title}
                  className="rounded-lg w-full h-48 object-cover "
                />
                <p className="mt-2  text-base text-center text-black">{img.title}</p>
              </div>
            ))}
          </div>

          {/* Fixed Bottom Bar */}
          <div className="fixed bottom-0 left-0 w-full z-10 py-3 px-6 flex justify-end items-center ">
            <button
              onClick={() => setIsOpen(true)}
              className="px-5 py-2 bg-green-400 text-white font-semibold rounded-xl shadow hover:bg-green-500 transition text-sm"
            >
              ➕ Add Image
            </button>
          </div>

          {/* Upload Form Dialog */}
          <Dialog
            open={isOpen}
            onClose={() => setIsOpen(false)}
            className="relative z-50"
          >
            <div className="fixed inset-0 bg-black/30" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <div
                role="dialog"
                aria-modal="true"
                className="mx-auto max-w-md w-full bg-white rounded-lg p-6 shadow-lg space-y-4"
              >
                <h2 className="text-lg font-semibold text-center">
                  📤 Upload Image
                </h2>
                <UploadForm
                  fixedUserId={user.uid}
                  onUploadSuccess={fetchImages}
                  onClose={() => setIsOpen(false)}
                />
              </div>
            </div>
          </Dialog>

          {/* Image Preview Modal */}
          <ImagePreviewModal
            image={selectedImage}
            onClose={() => setSelectedImage(null)}
          />
        </>
      )}
    </div>
  );
}
