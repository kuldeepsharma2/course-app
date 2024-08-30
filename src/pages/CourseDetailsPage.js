// src/pages/CourseDetailsPage.js
import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import CourseDetails from '../components/CourseDetails';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { useCart } from '../contexts/CartContext'; // Assuming you're using CartContext

const CourseDetailsPage = ({ match }) => {
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;
  const { addItemToCart } = useCart(); // Hook for cart context

  useEffect(() => {
    const fetchCourse = async () => {
      const docRef = doc(db, 'courses', match.params.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCourse(docSnap.data());
      }
    };

    const checkEnrollment = async () => {
      if (user) {
        try {
          const enrolledCoursesRef = doc(db, 'students', user.uid);
          const enrolledCoursesDoc = await getDoc(enrolledCoursesRef);
          if (enrolledCoursesDoc.exists()) {
            const enrolledCourses = enrolledCoursesDoc.data().courses || [];
            setIsEnrolled(enrolledCourses.some(enrolledCourse => enrolledCourse.id === match.params.id));
          }
        } catch (error) {
          console.error('Error checking enrollment:', error);
        }
      }
    };

    fetchCourse();
    checkEnrollment();
  }, [match.params.id, user]);

  const handleBuyNow = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await addItemToCart(course);
      alert('Item added to cart!');
      navigate('/cart');
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      {course ? (
        <div>
          <div className="relative mb-6">
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-[300px] object-cover rounded-t-lg"
            />
            <h2 className="absolute bottom-4 left-4 text-white text-3xl font-bold bg-black bg-opacity-50 p-2 rounded-lg">{course.title}</h2>
          </div>
          <CourseDetails course={course} />
          <div className="flex justify-center mt-4">
            {isEnrolled ? (
              <p className="text-red-500 font-semibold">You have already enrolled in this course.</p>
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
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default CourseDetailsPage;
