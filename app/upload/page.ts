'use client';
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

const IMAGES_PER_PAGE = 8;

export default function Home() {
    const [images, setImages] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchImages = async () => {
            const q = query(collection(db, 'images'), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            const imageUrls = snapshot.docs.map(doc => doc.data().url);
            setImages(imageUrls);
        };

        fetchImages();
    }, []);

    const totalPages = Math.ceil(images.length / IMAGES_PER_PAGE);
    const startIndex = (currentPage - 1) * IMAGES_PER_PAGE;
    const currentImages = images.slice(startIndex, startIndex + IMAGES_PER_PAGE);

    const goToNext = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    const goToPrevious = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    return (
        <div className= "p-4" >
        <h1 className="text-xl font-bold mb-4 text-center" > Animal Gallery 🐾</h1>
            < div className = "grid grid-cols-2 md:grid-cols-4 gap-4 mb-6" >
            {
                currentImages.map((url, i) => (
                    <img key= { i } src = { url } alt = "Uploaded" className = "rounded shadow" />
        ))
            }
                </div>

    {/* Pagination Buttons */ }
    <div className="flex justify-center gap-4" >
        <button
          onClick={ goToPrevious }
    disabled = { currentPage === 1
}
className = {`px-4 py-2 bg-gray-200 rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}`}
        >
    Previous
    </button>

    < span className = "px-4 py-2" > Page { currentPage } of { totalPages } </span>

        < button
onClick = { goToNext }
disabled = { currentPage === totalPages}
className = {`px-4 py-2 bg-gray-200 rounded ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}`}
        >
    Next
    </button>
    </div>
    </div>
  );
}
