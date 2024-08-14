import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { Link } from "react-router-dom";

import axiosInstance from "../Helpers/axiosInstance";
import HomeLayout from "../Layouts/HomeLayout";

function Changepassword() {
    const [password,setpassword] = useState({
        oldpassword : "",
        newpassword : ""
    })
function handleInput(e) {
    const {name,value} = e.target
        setpassword({
            ...password,
            [name] : value
           
        }
    )
}

async function onFormSubmit(e) {
    e.preventDefault();
    const oldPassword = password?.oldpassword;
    const newPassword = password?.newpassword;
    if (!oldPassword || !newPassword) {
        toast.error('All fields are required')
        return;
    }
    try {
        const response = axiosInstance.post('/user/change-password',{oldPassword,newPassword})
        toast.promise(response,{
            loading : "Wait updating password",
            success : (data)=>data?.data?.message,
            error : "Failed to update password"
        })
        const resData = (await response).data;
        if (resData?.success) {
            setpassword({
                oldpassword : "",
                newpassword : ""
            })
        }
    } catch (error) {
        toast.error(error?.response?.data?.message)
    }
}

    return(
        <HomeLayout>
            <div className="min-h-[90vh] flex items-center justify-center">
            <form onSubmit={onFormSubmit}
            className="shadow-[0_0_10px_black] flex flex-col items-center gap-4 w-96 p-4 rounded-lg text-white bg">
            <h1 className="text-rose-500 font-semibold text-xl">Change Password</h1>
                <div className="w-full h-auto space-y-2">
                <label 
                className="text-yellow-600 text-lg font-semibold"
                htmlFor="oldpassword">
                    Old Password
                </label>
                <input type="password"
                    id="oldpassword"
                    name="oldpassword"
                    placeholder="Enter Old password"
                    className="w-full bg-transparent rounded-md py-2 px-4"
                    onChange={handleInput}
                    value={password.oldpassword}
                />
                </div>
                <div className="w-full h-auto space-y-2">
                <label 
                className="text-yellow-600 text-lg font-semibold"
                htmlFor="newpassword">
                    New Password
                </label>
                <input type="password"
                    id="newpassword"
                    name="newpassword"
                    placeholder="Enter new password"
                    className="w-full bg-transparent rounded-md py-2 px-4"
                    onChange={handleInput}
                    value={password.newpassword}
                />
                </div>
                <div className="w-full">
                <button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 text-lg cursor-pointer rounded-lg py-1">
                Update password
                </button>
                    <Link to="/user/profile">
                    <p className="link text-accent cursor-pointer flex items-center justify-center w-full gap-2">
                    <AiOutlineArrowLeft/>Go back to profile
                    </p>
                    </Link>
                </div>
            </form>
            </div>
        </HomeLayout>
    )
}
export default Changepassword;