'use client';
import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase';

export default function UploadPage() {
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!image) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', 'YOUR_CLOUDINARY_UPLOAD_PRESET'); // Replace this with your preset

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.secure_url) {
        await addDoc(collection(db, 'images'), {
          url: data.secure_url,
          createdAt: serverTimestamp(),
        });
        alert('Image uploaded successfully!');
        setImage(null);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Animal Photos 🐶</h1>
      <input type="file" accept="image/*" onChange={e => setImage(e.target.files?.[0] || null)} />
      <button
        onClick={handleUpload}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
}
