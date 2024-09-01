import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';
import { toast, ToastContainer } from 'react-toastify'; // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

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

      // Show success toast and delay redirection
      toast.success('Item added to cart! Redirecting to cart...');
      setTimeout(() => {
        navigate('/cart');
      }, 7000); // Delay redirection by 7 seconds
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast.error('Error adding item to cart');
    }
  };

  if (!course) {
    return <div>No course details available.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12">
      <h1 className="text-3xl font-bold mb-4 text-center">{course.title}</h1>
      {course.image && (
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-100 object-cover mb-4 rounded-lg shadow-lg"
        />
      )}
      <div className="text-lg mb-4 space-y-2">
        <p><strong>Description:</strong> {course.description}</p>
        <p><strong>Instructor:</strong> {course.instructor}</p>
        <p><strong>Price:</strong> ${course.price}</p>
        <p><strong>Duration:</strong> {new Date(course.duration).toLocaleString()}</p>
        <p><strong>Schedule:</strong> {new Date(course.schedule).toLocaleString()}</p>
        <p><strong>Location:</strong> {course.location}</p>
        <p><strong>Pre-requisites:</strong> {course.prerequisites}</p>
        <p><strong>Enrollment Status:</strong> {course.enrollmentStatus}</p>
      </div>

      {/* Syllabus as an expandable item */}
      <details className="mt-4">
        <summary className="cursor-pointer text-blue-500 font-semibold">View Syllabus</summary>
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
            className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-300"
          >
            Buy Now
          </button>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

export default CourseDetailPage;
