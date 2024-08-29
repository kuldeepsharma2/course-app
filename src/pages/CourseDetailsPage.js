// src/pages/CourseDetailsPage.js
import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import CourseDetails from '../components/CourseDetails';

const CourseDetailsPage = ({ match }) => {
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      const docRef = doc(db, "courses", match.params.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCourse(docSnap.data());
      }
    };
    fetchCourse();
  }, [match.params.id]);

  return (
    <div className="container mx-auto mt-8">
      {course ? <CourseDetails course={course} /> : <p>Loading...</p>}
    </div>
  );
};

export default CourseDetailsPage;
