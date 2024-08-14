import { useEffect } from "react";
import toast from "react-hot-toast";
import { BiRupee } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import HomeLayout from "../../Layouts/HomeLayout";
import { getRazorpayId, purchaseCourseBundle, verifyUserPayment } from "../../Redux/Slices/RazorpaySlice";

function Checkout() {
    const disapatch = useDispatch()
    const navigate = useNavigate()
    const razorpaykey = useSelector((state)=>state?.razorpay?.key)
    const subscription_id = useSelector((state)=>state?.razorpay?.subscription_id)
    const userdata = useSelector((state)=>state?.auth?.data)
    const paymentDetails = {
        payment_id : "",
        subscription_id : "",
        signature : ""
    }
    
    async function handleSubscription(e) {
        e.preventDefault();
        if(!razorpaykey || !subscription_id){
            toast.error("something went wrong")
            return;
        }
       const option = {
        key : razorpaykey,
        subscription_id : subscription_id,
        name : "Coursify Pvt. Ltd",
        description : "Subscription",
        theme : {
            color : '#F37254'
        },
        prefill : {
            email : userdata.email,
            name : userdata.fullName
        },
        handler : async function(response){
            paymentDetails.payment_id = response.payment_id,
            paymentDetails.subscription_id = response.subscription_id,
            paymentDetails.signature = response.signature;

           toast.success('payment successful')
           const res = await disapatch(verifyUserPayment(paymentDetails))

           res?.payload?.success ? navigate('/checkout/success') : navigate('/checkout/fail')
        }
       } 
       const paymentObject = new window.Razorpay(option)
       paymentObject.open()
    }

    async function load() {
        await disapatch(getRazorpayId())
        await disapatch(purchaseCourseBundle())
    }
    useEffect(()=>{
        // load()
    },[])

    return(
        <HomeLayout>
            <form 
            // onSubmit={handleSubscription}
            className="min-h-[90vh] flex flex-col justify-center items-center text-white"
            >
            <div className="w-80 h-[26rem] flex flex-col justify-center shadow-[0_0_10px_black] rounded-r-lg relative">
                <h1
                className="bg-yellow-500 absolute top-0 w-full text-center py-4 text-2xl font-bold rounded-tl-lg rounded-tr-lg"
                >Subscription Bundle</h1>
                <div className="px-4 space-y-5 text-center">
                    <p className="text-[17px]">
                        This purchase will allow you to access all available course of our platform for {' '}
                        <span className="text-yellow-500 font-bold">
                            <br />
                            1 Year duration
                        </span> {" "}
                        All the existing and new launched will be also available
                    </p>  
                    <p className="flex items-center justify-center gap-1 text-2xl font-bold text-yellow-500">
                        <BiRupee/>
                        <span>499 only</span>
                    </p>
                    <div className="text-gray-200">
                        <p>100% refund on cancellation</p>
                        <p>* Terms and conditions applied</p>
                    </div>
                    <button type="submit" 
                    className="bg-yellow-500 hover:bg-yellow-600 transition-all ease-in-out duration-300 absolute bottom-0 left-0 w-full font-bold rounded-bl-lg rounded-br-lg py-2">
                        Buy Now
                    </button>
                </div>
            </div>
            </form>
        </HomeLayout>
    )
}

export default Checkout;