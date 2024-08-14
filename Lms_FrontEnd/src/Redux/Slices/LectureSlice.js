import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import axiosInstance from "../../Helpers/axiosInstance";

let initialState = {
    lectures : []
};

export const getCourseLecture = createAsyncThunk('/course/getLecture',async (cid)=>{
    try {
        const response = axiosInstance.get(`/courses/${cid}`)
        toast.promise(response,{
            loading : 'Fetching Course Lectures',
            success : 'Lecture fetched successfully',
            error : 'Failed to load the lectures'
        })
        return (await response).data
    } catch (error) {
        toast.error(error?.response?.data?.message)
    }
})
export const addCourseLecture = createAsyncThunk('/course/addlectures',async (data)=>{
    try {
        const formData = new FormData()
        formData.append('title',data.title)
        formData.append('lecture',data.lecture)
        formData.append('description',data.description)
        const response = axiosInstance.post(`/courses/${data.id}`,formData)
        toast.promise(response,{
            loading : 'Adding Course Lectures',
            success : 'Lecture added successfully',
            error : 'Failed to add the lectures'
        })
        return (await response).data
    } catch (error) {
        toast.error(error?.response?.data?.message)
    }
})
export const deleeteCourseLecture = createAsyncThunk('/course/deletelecture',async (data)=>{
    try {
        const response = axiosInstance.delete(`/courses?courseId=${data.courseId}&lectureId=${data.lectureId}`)
        toast.promise(response,{
            loading : 'Deleting Course Lectures',
            success : 'Lecture deleted successfully',
            error : 'Failed to delete the lectures'
        })
        return (await response).data
    } catch (error) {
        toast.error(error?.response?.data?.message)
    }
})

const lectureSlice = createSlice({
    name : "lectures",
    initialState,
    reducers :{},
    extraReducers : (builder)=>{
        builder.addCase(getCourseLecture.fulfilled,(state,action)=>{
           state.lectures = action?.payload?.lectures; 
        })
        .addCase(addCourseLecture.fulfilled,(state,action)=>{
            state.lectures = action?.payload?.course?.lectures;
        })
        
    }
})
export default lectureSlice.reducer;