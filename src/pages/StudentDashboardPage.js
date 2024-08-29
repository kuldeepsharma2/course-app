// src/pages/StudentDashboardPage.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { setEnrolledCourses } from '../store/courseSlice';
import StudentDashboard from '../components/StudentDashboard';

const StudentDashboardPage = () => {
  const dispatch = useDispatch();
  const enrolledCourses = useSelector((state) => state.courses.enrolledCourses);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "enrolledCourses"), (snapshot) => {
      const courseData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch(setEnrolledCourses(courseData));
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <div className="container mx-auto mt-8">
      <StudentDashboard courses={enrolledCourses} />
    </div>
  );
};

export default StudentDashboardPage;
