import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';

function CourseDetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  const { course } = location.state || {};
  const [isEnrolled, setIsEnrolled] = useState(false);
  
  useEffect(() => {
    const checkEnrollment = async () => {
      if (user && course) {
        try {
          const enrolledCoursesRef = doc(db, 'students', user.uid);
          const enrolledCoursesDoc = await getDoc(enrolledCoursesRef);
          if (enrolledCoursesDoc.exists()) {
            const enrolledCourses = enrolledCoursesDoc.data().courses || [];
            setIsEnrolled(enrolledCourses.some(enrolledCourse => enrolledCourse.id === course.id));
          }
        } catch (error) {
          console.error('Error checking enrollment:', error);
        }
      }
    };

    checkEnrollment();
  }, [user, course]);

  const handleBuyNow = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await setDoc(doc(db, 'carts', user.uid), {
        [course.id]: {
          ...course,
          quantity: 1,
        },
      }, { merge: true });

      alert('Item added to cart!');
      navigate('/cart');
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  if (!course) {
    return <div>No course details available.</div>;
  }

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">{course.title}</h1>
      {course.image && (
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-[60%] object-contain mb-4 rounded-md"
        />
      )}
      <p className="text-lg">{course.description}</p>
      <p className="text-lg">Instructor: {course.instructor}</p>
      <p className="text-lg">Price: ${course.price}</p>
      <p className="text-lg">Duration: {new Date(course.duration).toLocaleString()}</p>
      <p className="text-lg">Schedule: {new Date(course.schedule).toLocaleString()}</p>
      <p className="text-lg">Location: {course.location}</p>
      <p className="text-lg">Pre-requisites: {course.prerequisites}</p>
      <p className="text-lg">Enrollment Status: {course.enrollmentStatus}</p>
      
      {/* Syllabus as an expandable item */}
      <details className="mt-4">
        <summary className="cursor-pointer text-blue-500">View Syllabus</summary>
        <div className="mt-2">
          <p>{course.syllabus}</p>
        </div>
      </details>
      
      <div className="mt-4 flex items-center justify-center">
        {isEnrolled ? (
          <p className="text-red-500 font-semibold">You are already enrolled in this course</p>
        ) : (
          <button
            onClick={handleBuyNow}
            className="bg-green-500 text-white px-4 py-2 rounded-lg"
          >
            Buy Now
          </button>
        )}
      </div>
    </div>
  );
}

export default CourseDetailPage;
