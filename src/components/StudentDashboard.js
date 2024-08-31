import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase';

function StudentDashboardPage() {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const fetchEnrolledCourses = async () => {
        try {
          const studentDoc = await getDoc(doc(db, 'students', user.uid));
          if (studentDoc.exists()) {
            setEnrolledCourses(studentDoc.data().courses || []);
          }
        } catch (error) {
          console.error('Error fetching enrolled courses:', error);
        }
      };

      fetchEnrolledCourses();
    }
  }, [user]);

  return (
    <div className="container mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Your Enrolled Courses</h1>
      {enrolledCourses.length > 0 ? (
        <div className="space-y-4">
          {enrolledCourses.map(course => (
            <div
              key={course.id} // Ensure each item has a unique key
              className="flex flex-col sm:flex-row bg-white shadow-lg rounded-lg mb-4 p-4"
            >
              <div className="flex-shrink-0 mb-4 sm:mb-0 sm:w-1/3">
                {course.image && (
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-contain rounded-md"
                  />
                )}
              </div>
              <div className="flex-1 sm:ml-4">
                <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
                <p className="mb-2">{course.description}</p>
                <p className="text-gray-500 mb-2">Price: ${course.price}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">You are not enrolled in any courses.</p>
      )}
    </div>
  );
}

export default StudentDashboardPage;
