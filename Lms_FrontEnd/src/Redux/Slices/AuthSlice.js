import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import axiosInstance from "../../Helpers/axiosInstance";

let initialState = {
    isLoggedin : JSON.parse(localStorage.getItem('loggedIn')) || false,
    role : JSON.parse(localStorage.getItem('role')) || '',
    data : JSON.parse(localStorage.getItem('data')) || {}
}

export const createAccount = createAsyncThunk('/auth/signup',async(data)=>{
    try {
        const res = axiosInstance.post('/user/register',data);
        toast.promise(res,{
            loading : 'Wait! creating your account',
            success : (data) =>{
               return data?.data?.message; 
            },
            error : 'Failed to create account'
        })
        return (await res).data
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
})
export const editUserProfile = createAsyncThunk('/auth/editprofile',async(data)=>{
    try {
        const res = axiosInstance.put(`/user/update`,data);
        toast.promise(res,{
            loading : 'Wait! editing your profile',
            success : (data) =>{
               return data?.data?.message; 
            },
            error : 'Failed to edit profile'
        })
        return (await res).data
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
})
export const login = createAsyncThunk('/auth/login',async(data)=>{
    try {
        const res = axiosInstance.post('/user/login',data);
        toast.promise(res,{
            loading : 'Wait! authentication in progress...',
            success : (data) =>{
               return data?.data?.message; 
            },
            error : 'Failed to log in'
        })
        return (await res).data
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
})
export const updateUserData = createAsyncThunk('/auth/me',async()=>{
    try {
        const res = axiosInstance.get('/user/me');
        return (await res).data
    } catch (error) {
      toast.error(error?.message);
    }
})
export const logout = createAsyncThunk('auth/logout',async ()=>{
    try {
        const res = axiosInstance.get('/user/logout');
        toast.promise(res,{
            loading : 'logout in progress..',
            success : (data)=>data?.data?.message,
            error : 'Failed to logout'
        })
    } catch (error) {
        toast.error(error?.response?.data?.message)
    }
})

const AuthSlice = createSlice({
    name : 'auth',
    initialState,
    reducers:{},
    extraReducers : (builder)=>{
        builder.addCase(login.fulfilled, (state,action)=>{
           localStorage.setItem('data',JSON.stringify(action?.payload?.user));
           localStorage.setItem('role',JSON.stringify(action?.payload?.user?.role));
           localStorage.setItem('loggedIn',true);
           state.isLoggedin =true;
           state.data = action?.payload?.user;
           state.role = action?.payload?.user?.role;
        }).addCase(logout.fulfilled,(state)=>{
            localStorage.clear();
            state.data = {};
            state.isLoggedin = false;
            state.role = ''
        }).addCase(updateUserData.fulfilled,(state,action)=>{
            localStorage.setItem('data',JSON.stringify(action?.payload?.user));
           localStorage.setItem('role',JSON.stringify(action?.payload?.user?.role));
           state.data = action?.payload?.user;
           state.role = action?.payload?.user?.role;
        })
    }
});

// export const {} = AuthSlice.actions;
export default AuthSlice.reducer;