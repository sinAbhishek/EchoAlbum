'use client';
import { useEffect, useState } from 'react';
import { db } from '@/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

const IMAGES_PER_PAGE = 8;

export default function GalleryPage() {
  const [images, setImages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchImages = async () => {
      const q = query(collection(db, 'images'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const urls = snapshot.docs.map(doc => doc.data().url as string);
      setImages(urls);
    };
    fetchImages();
  }, []);

  const totalPages = Math.ceil(images.length / IMAGES_PER_PAGE);
  const start = (currentPage - 1) * IMAGES_PER_PAGE;
  const currentImages = images.slice(start, start + IMAGES_PER_PAGE);

  return (
    <div className="p-4">
      <h1 className="text-center text-3xl font-bold mb-6">Animal Album 🐾</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {currentImages.map((url, index) => (
          <img key={index} src={url} alt="animal" className="rounded shadow" />
        ))}
      </div>
      <div className="flex justify-center items-center gap-4">
        <button
          onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
