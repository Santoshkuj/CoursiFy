import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import axiosInstance from "../../Helpers/axiosInstance";

const initialState = {
    courseData : []
};

export const getAllCourses = createAsyncThunk('/course/get',async()=> {
    try {
        const response = axiosInstance.get('/courses');
        toast.promise(response,{
            loading : 'Loading course data..',
            success : (res)=>res?.data?.message,
            error : 'Failed to load courses'
        })
        return (await response).data.courses;    
    } catch (error) {
        toast.error(error?.response?.data?.message)
    }
})
export const deleteCourse = createAsyncThunk('/course/delete',async(id)=> {
    try {
        const response = axiosInstance.delete(`/courses/${id}`);
        toast.promise(response,{
            loading : 'Deleting course..',
            success : (res)=>res?.data?.message,
            error : 'Failed delete courses'
        })
        return (await response).data;    
    } catch (error) {
        toast.error(error?.response?.data?.message)
    }
})

export const createNewCourse = createAsyncThunk('/course/create',async (data)=>{
    try {
        let formData = new FormData()
        formData.append("title",data.title)
        formData.append("description",data.description)
        formData.append("createdBy",data.createdBy)
        formData.append("thumbnail",data.thumbnail)
        formData.append("category",data.category)

        const response = axiosInstance.post('/courses',formData);
        toast.promise(response,{
            loading : "Creating Course..",
            success : (data)=> data?.data?.message,
            error : "Failed to create course"
        })
        return (await response).data
    } catch (error) {
       toast.error(error?.response?.data?.message) 
    }
})

const courseSlice = createSlice({
    name : 'courses',
    initialState,
    reducers: {},
    extraReducers : (builder) =>{
      builder.addCase(getAllCourses.fulfilled,(state,action)=>{
        if (action.payload) {
            state.courseData = [...action.payload];
        }
      })  
    }
});

export default courseSlice.reducer;