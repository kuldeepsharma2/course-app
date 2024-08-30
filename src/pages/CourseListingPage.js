import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function CourseListingPage() {
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const coursesPerPage = 9;
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courseCollection = await getDocs(collection(db, 'courses'));
        const fetchedCourses = courseCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCourses(fetchedCourses);
        setTotalPages(Math.ceil(fetchedCourses.length / coursesPerPage));
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    const fetchEnrolledCourses = async () => {
      if (user) {
        try {
          const enrolledCoursesRef = doc(db, 'students', user.uid);
          const enrolledCoursesDoc = await getDoc(enrolledCoursesRef);
          if (enrolledCoursesDoc.exists()) {
            setEnrolledCourses(enrolledCoursesDoc.data().courses || []);
          }
        } catch (error) {
          console.error('Error fetching enrolled courses:', error);
        }
      }
    };

    fetchCourses();
    fetchEnrolledCourses();
  }, [user]);

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleBuyNow = async (course) => {
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

  const isCourseEnrolled = (courseId) => {
    return enrolledCourses.some(enrolledCourse => enrolledCourse.id === courseId);
  };

  const handleCourseClick = (course) => {
    navigate('/course-detail', { state: { course } }); // Navigate to course detail page with course data
  };

  return (
    <div className="container mx-auto mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentCourses.map((course) => (
          <div
            key={course.id}
            className="border rounded-lg p-4 shadow-lg flex flex-col justify-between"
            onClick={() => handleCourseClick(course)}
          >
            {course.image && (
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-[60%] object-contain mb-4 rounded-md"
              />
            )}
            <div className="p-3 flex-1">
              <h2 className="text-xl font-semibold">{course.title}</h2>
              <p className="line-clamp-3 mt-2">{course.description}</p>
            </div>
            <div className="mt-3">
              <p className="text-center font-semibold">Price: ${course.price}</p>
            </div>
            <div className="flex items-center justify-center mt-4">
              {isCourseEnrolled(course.id) ? (
                <p className="text-red-500 font-semibold">Course already enrolled</p>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBuyNow(course);
                  }}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg w-full"
                >
                  Buy Now
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {courses.length > coursesPerPage && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2"
          >
            Previous
          </button>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default CourseListingPage;
