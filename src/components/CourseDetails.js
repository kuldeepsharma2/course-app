// src/components/CourseDetails.js
import React from 'react';

const CourseDetails = ({ course }) => {
  return (
    <div className="p-8 border rounded shadow-lg">
      <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
      <p>Instructor: {course.instructor}</p>
      <p>Description: {course.description}</p>
      <p>Enrollment Status: {course.enrollmentStatus}</p>
      <p>Duration: {course.duration}</p>
      <p>Schedule: {course.schedule}</p>
      <p>Location: {course.location}</p>
      <p>Pre-requisites: {course.prerequisites.join(', ')}</p>
      <details>
        <summary>Syllabus</summary>
        <ul>
          {course.syllabus.map((week, index) => (
            <li key={index}>
              Week {week.week}: {week.topic}
              <p>{week.content}</p>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
};

export default CourseDetails;
