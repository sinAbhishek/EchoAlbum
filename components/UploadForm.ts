'use client';
import { useState } from 'react';
import { storage, db } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function UploadForm() {
    const [image, setImage] = useState(null);

    const handleUpload = async () => {
        if (!image) return;

        const imageRef = ref(storage, `animal-images/${image.name}`);
        await uploadBytes(imageRef, image);

        const url = await getDownloadURL(imageRef);
        await addDoc(collection(db, 'images'), {
            url,
            createdAt: serverTimestamp(),
        });

        setImage(null);
        alert("Image uploaded!");
    };

    return (
        <div className= "p-4" >
        <input type="file" onChange = { e => setImage(e.target.files[0]) } />
            <button onClick={ handleUpload } className = "bg-blue-500 text-white px-4 py-2 mt-2" >
                Upload
                </button>
                </div>
  );
}
