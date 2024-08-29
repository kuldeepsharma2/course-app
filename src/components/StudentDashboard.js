// src/components/StudentDashboard.js
import React from 'react';

const StudentDashboard = ({ courses }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {courses.map(course => (
        <div key={course.id} className="p-4 border rounded shadow-sm">
          <h2 className="text-xl font-bold">{course.name}</h2>
          <p>Instructor: {course.instructor}</p>
          <p>Due Date: {course.dueDate}</p>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-blue-600">
                  {course.progress}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
              <div style={{ width: `${course.progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
            </div>
          </div>
          <button className="mt-2 px-4 py-2 bg-green-500 text-white rounded" onClick={() => console.log(`Completed ${course.name}`)}>
            Mark as Completed
          </button>
        </div>
      ))}
    </div>
  );
};

export default StudentDashboard;
