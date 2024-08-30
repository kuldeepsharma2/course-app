import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db, storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

function AddCourse() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState(''); // Updated to date-time
  const [schedule, setSchedule] = useState(''); // Updated to date-time
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const auth = getAuth();
  const user = auth.currentUser;

  const handleImageUpload = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        resolve('');
        return;
      }

      const storageRef = ref(storage, `courses/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Track progress if needed
        },
        (error) => {
          console.error('Error uploading image:', error);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !price || !duration || !schedule || !image) {
      setError('All fields are required!');
      return;
    }

    setError('');
    setUploading(true);

    try {
      const imageUrl = await handleImageUpload(image);

      const courseData = {
        title,
        description,
        price,
        duration,
        schedule,
        createdBy: user.email,
        createdAt: serverTimestamp(),
        image: imageUrl, // Store the URL of the uploaded image
      };

      await addDoc(collection(db, 'courses'), courseData);

      // Reset form fields
      setTitle('');
      setDescription('');
      setPrice('');
      setDuration('');
      setSchedule('');
      setImage(null);
      setUploading(false);

      alert('Course added successfully!');
    } catch (error) {
      console.error('Error adding course:', error);
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Add Course</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Course Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 mb-2 w-full"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 mb-2 w-full"
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-2 mb-2 w-full"
          required
        />
        <input
          type="datetime-local" // Updated to date-time
          placeholder="Duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="border p-2 mb-2 w-full"
          required
        />
        <input
          type="datetime-local" // Updated to date-time
          placeholder="Schedule"
          value={schedule}
          onChange={(e) => setSchedule(e.target.value)}
          className="border p-2 mb-2 w-full"
          required
        />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          className="border p-2 mb-4 w-full"
          required
        />
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <button
          type="submit"
          className={`bg-blue-500 text-white p-2 rounded ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Add Course'}
        </button>
      </form>
    </div>
  );
}

export default AddCourse;
