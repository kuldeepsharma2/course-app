import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db, storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

function AddCourse() {
  const [title, setTitle] = useState('');
  const [instructor, setInstructor] = useState('');
  const [description, setDescription] = useState('');
  const [enrollmentStatus, setEnrollmentStatus] = useState('Open');
  const [duration, setDuration] = useState('');
  const [schedule, setSchedule] = useState('');
  const [location, setLocation] = useState('');
  const [prerequisites, setPrerequisites] = useState('');
  const [syllabus, setSyllabus] = useState('');
  const [price, setPrice] = useState('');
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

    if (!title || !instructor || !description || !price || !duration || !schedule || !location || !image) {
      setError('All required fields must be filled out!');
      return;
    }

    setError('');
    setUploading(true);

    try {
      const imageUrl = await handleImageUpload(image);

      const courseData = {
        title,
        instructor,
        description,
        enrollmentStatus,
        duration,
        schedule,
        location,
        prerequisites,
        syllabus,
        price,
        createdBy: user.email,
        createdAt: serverTimestamp(),
        image: imageUrl,
      };

      await addDoc(collection(db, 'courses'), courseData);

      // Reset form fields
      setTitle('');
      setInstructor('');
      setDescription('');
      setEnrollmentStatus('Open');
      setDuration('');
      setSchedule('');
      setLocation('');
      setPrerequisites('');
      setSyllabus('');
      setPrice('');
      setImage(null);
      setUploading(false);

      alert('Course added successfully!');
    } catch (error) {
      console.error('Error adding course:', error);
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Add Course</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Course Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-gray-300 rounded-lg p-3 w-full"
          required
        />
        <input
          type="text"
          placeholder="Instructor's Name"
          value={instructor}
          onChange={(e) => setInstructor(e.target.value)}
          className="border border-gray-300 rounded-lg p-3 w-full"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border border-gray-300 rounded-lg p-3 w-full h-32 resize-none"
          required
        />
        <select
          value={enrollmentStatus}
          onChange={(e) => setEnrollmentStatus(e.target.value)}
          className="border border-gray-300 rounded-lg p-3 w-full"
          required
        >
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
          <option value="In Progress">In Progress</option>
        </select>
        <input
          type="datetime-local"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="border border-gray-300 rounded-lg p-3 w-full"
          required
        />
        <input
          type="datetime-local"
          value={schedule}
          onChange={(e) => setSchedule(e.target.value)}
          className="border border-gray-300 rounded-lg p-3 w-full"
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border border-gray-300 rounded-lg p-3 w-full"
          required
        />
        <textarea
          placeholder="Pre-requisites"
          value={prerequisites}
          onChange={(e) => setPrerequisites(e.target.value)}
          className="border border-gray-300 rounded-lg p-3 w-full h-32 resize-none"
        />
        <textarea
          placeholder="Syllabus"
          value={syllabus}
          onChange={(e) => setSyllabus(e.target.value)}
          className="border border-gray-300 rounded-lg p-3 w-full h-32 resize-none"
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border border-gray-300 rounded-lg p-3 w-full"
          required
        />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          className="border border-gray-300 rounded-lg p-3 w-full"
          required
        />
        {error && <p className="text-red-500 mb-2 text-center">{error}</p>}
        <button
          type="submit"
          className={`bg-blue-500 text-white p-3 rounded-lg w-full ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Add Course'}
        </button>
      </form>
    </div>
  );
}

export default AddCourse;
