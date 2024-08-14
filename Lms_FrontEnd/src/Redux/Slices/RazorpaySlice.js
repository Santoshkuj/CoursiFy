import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import toast from "react-hot-toast"

import axiosInstance from "../../Helpers/axiosInstance"

const initialState = {
    key : "",
    subscription_id : "",
    isPaymentVerified : "",
    allPayments : "",
    finalMonths : "",
    monthlySalesRecord : ""
}

export const getRazorpayId = createAsyncThunk('/razorpay/getId', async () =>{
    try {
        const response = await axiosInstance.get("/payments/razorpay-key")
        return response.data
    } catch (error) {
       toast.error('failed to get data') 
    }
})
export const purchaseCourseBundle = createAsyncThunk('/purchaseCourse', async () =>{
    try {
        const response = await axiosInstance.post("/payments/subscribe")
        return response.data
    } catch (error) {
       toast.error(error?.response?.data?.message) 
    }
})
export const verifyUserPayment = createAsyncThunk('/payment/verify', async (data) =>{
    try {
        const response = await axiosInstance.post("/payments/verify",{
            payment_id : data.payment_id,
            subscription_id : data.subscription_id,
            signature : data.signature
        })
        return response.data
    } catch (error) {
       toast.error(error?.response?.data?.message) 
    }
})
export const getPaymentRecord = createAsyncThunk('/payment/record', async () =>{
    try {
        const response =  axiosInstance.get("/payments?count=100")
        toast.promise(response,{
            loading : "Getting the payment record",
            success : (data)=>{data?.data?.message},
            error : 'Failed to get payment records'
        })
        return (await response).data
    } catch (error) {
       toast.error('Failed to get payment records') 
    }
})
export const cancelCourseBundle = createAsyncThunk('/payment/cancel', async () =>{
    try {
        const response =  axiosInstance.get("/payments/unsubscribe")
        toast.promise(response,{
            loading : "unsubscribing the bundle",
            success : (data)=>{data?.data?.message},
            error : 'Failed to unsubscribe'
        })
        return (await response).data
    } catch (error) {
       toast.error(error?.response?.data?.message) 
    }
})

const razorpaySlice = createSlice({
    name : 'razorpay',
    initialState,
    reducers : {},
    extraReducers : (builder)=>{
        builder.addCase(getRazorpayId.fulfilled,(state,action)=>{
           state.key = action?.payload?.key;
        })
        .addCase(purchaseCourseBundle.fulfilled,(state,action)=>{
          state.subscription_id = action?.payload?.subscription_id  
        })
        .addCase(verifyUserPayment.fulfilled,(state,action)=>{
            toast.success(action?.payload?.message)
            state.isPaymentVerified = action?.payload?.success
        })
        .addCase(verifyUserPayment.rejected,(state,action)=>{
            toast.rejected(action?.payload?.message)
            state.isPaymentVerified = action?.payload?.success
        })
        .addCase(getPaymentRecord.fulfilled,(state,action)=>{
            state.allPayments = action?.payload?.allPayments
            state.finalMonths = action?.payload?.finalMonths
            state.monthlySalesRecord = action?.payload?.monthlySalesRecord
        })
    }
})

export default razorpaySlice.reducer