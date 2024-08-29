import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function CourseListingPage() {
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [quantity, setQuantity] = useState({});
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
        const totalPages = Math.ceil(fetchedCourses.length / coursesPerPage);
        setTotalPages(totalPages);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleQuantityChange = (e, courseId) => {
    setQuantity({
      ...quantity,
      [courseId]: e.target.value,
    });
  };

  const handleBuyNow = async (course) => {
    if (!user) {
      navigate('/login');
      return;
    }

    const courseId = course.id;
    const courseQuantity = quantity[courseId] || 1;

    try {
      await setDoc(doc(db, 'carts', user.uid), {
        [courseId]: {
          ...course,
          quantity: parseInt(courseQuantity, 10),
        },
      }, { merge: true });

      alert('Item added to cart!');
      navigate('/cart');
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentCourses.map((course) => (
          <div key={course.id} className="border rounded-lg p-4 shadow-lg">
            {course.image && (
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-32 object-cover mb-4 rounded-md"
              />
            )}
            <h2 className="text-xl font-semibold">{course.title}</h2>
            <p>{course.description}</p>
            <p className="text-gray-500">Price: ${course.price}</p>
            <div className="flex items-center mt-4">
              <input
                type="number"
                min="1"
                value={quantity[course.id] || 1}
                onChange={(e) => handleQuantityChange(e, course.id)}
                className="border p-2 rounded mr-2 w-20"
              />
              <button
                onClick={() => handleBuyNow(course)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
              >
                Buy Now
              </button>
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
