// src/store/courseSlice.js
import { createSlice } from '@reduxjs/toolkit';

const courseSlice = createSlice({
  name: 'courses',
  initialState: {
    courseList: [],
    enrolledCourses: [],
  },
  reducers: {
    setCourses: (state, action) => {
      state.courseList = action.payload;
    },
    setEnrolledCourses: (state, action) => {
      state.enrolledCourses = action.payload;
    },
    updateCourseLikes: (state, action) => {
      const { courseId, likes } = action.payload;
      const course = state.courseList.find(c => c.id === courseId);
      if (course) {
        course.likes = likes;
      }
    },
  },
});

export const { setCourses, setEnrolledCourses, updateCourseLikes } = courseSlice.actions;
export default courseSlice.reducer;
