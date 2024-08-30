import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { doc, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase';
import { setEnrolledCourses } from '../store/courseSlice';
import StudentDashboard from '../components/StudentDashboard';

const StudentDashboardPage = () => {
  const dispatch = useDispatch();
  const enrolledCourses = useSelector((state) => state.courses.enrolledCourses);
  const auth = getAuth();
  const user = auth.currentUser; // Add this line to get the current user

  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(doc(db, "students", user.uid), (doc) => {
        const courseData = doc.data()?.courses || [];
        dispatch(setEnrolledCourses(courseData));
      });

      return () => unsubscribe();
    }
  }, [dispatch, user]); // Add `user` to the dependency array

  return (
    <div className="container mx-auto mt-8">
      <StudentDashboard courses={enrolledCourses} />
    </div>
  );
};

export default StudentDashboardPage;
