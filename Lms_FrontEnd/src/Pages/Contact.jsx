import { useState } from "react";
import toast from "react-hot-toast";

import axiosInstance from "../Helpers/axiosInstance";
import { validEmail } from "../Helpers/regexMacher";
import HomeLayout from "../Layouts/HomeLayout";

function Contact() {

    const [inputvalue,setInputvalue] = useState({
        name : "",
        email : "",
        message : ""
    })

    function handleInputChange(e) {
      const {id, value} = e.target;
      setInputvalue({
        ...inputvalue,
        [id] : value
      })
    }
    
    async function onFormSubmit(e) {
        e.preventDefault();
        if(!inputvalue.name || !inputvalue.email || !inputvalue.message){
            toast.error('All fields are mandatory')
            return;
        }
        if(!validEmail(inputvalue.email)){ 
            toast.error('Provide a valid Email')
            return;
        }
        try {
            const response = axiosInstance.post('/contact',inputvalue);
            toast.promise(response,{
                loading: 'Submitting your message',
                success : data => data.data.message,
                error : 'Failed to submit the contact'
            })
            const responseData = (await response).data;
            if(responseData?.success){
                setInputvalue({
                    name : "",
                    email : "",
                    message : ""
                })
            }
        } catch (error) {
            toast.error(error?.response?.data?.message)
        }
    }
    return(
        <HomeLayout>
            <div onSubmit={onFormSubmit}
            className="flex items-center justify-center h-[90vh]">
            <form className="flex flex-col items-center justify-center gap-2 p-5 rounded-md text-white shadow-[0_0_10px_black] w-[22rem]" noValidate>
                <h1 className="text-3xl font-semibold">
                    Contact form
                </h1>
                <div className="flex flex-col w-full gap-1">
                    <label htmlFor="name" className="text-xl font-semibold">
                        name
                    </label>
                    <input
                    className="bg-transparent border px-2 py-1 rounded-sm"
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your name"
                    onChange={handleInputChange}
                    value={inputvalue.name}
                    />
                </div>
                <div className="flex flex-col w-full gap-1">
                    <label htmlFor="email" className="text-xl font-semibold">
                        email
                    </label>
                    <input
                    className="bg-transparent border px-2 py-1 rounded-sm"
                    type="text"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    onChange={handleInputChange}
                    value={inputvalue.email}
                    />
                </div>
                <div className="flex flex-col w-full gap-1">
                    <label htmlFor="message" className="text-xl font-semibold">
                    message
                    </label>
                    <textarea
                    className="bg-transparent border px-2 py-1 rounded-sm resize-none h-48"
                    id="message"
                    name="message"
                    placeholder="Enter your message"
                    onChange={handleInputChange}
                    value={inputvalue.message}
                    />
                </div>
                <button type="submit"
                className="w-full bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold text-lg cursor-pointer">
                    submit
                </button>
            </form>
            </div>
        </HomeLayout>
    )
}

export default Contact;