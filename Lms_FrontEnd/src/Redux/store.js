import { configureStore } from "@reduxjs/toolkit";

import authReducer from './Slices/AuthSlice';
import CourseSliceReducer from "./Slices/CourseSlice";
import LectureSliceReducer from "./Slices/LectureSlice";
import RazorpayReducer from "./Slices/RazorpaySlice";
import StatSliceReducer from "./Slices/StatSlice";

const store = configureStore({
    reducer:{
        auth : authReducer,
        course : CourseSliceReducer,
        razorpay : RazorpayReducer,
        lecture : LectureSliceReducer,
        stats : StatSliceReducer
    },
    devTools: true
});
export default store;