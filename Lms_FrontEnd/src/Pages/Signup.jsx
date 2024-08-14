import { useState } from "react";
import toast from "react-hot-toast";
import { BsPersonCircle } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { validEmail, validPassword } from "../Helpers/regexMacher";
import HomeLayout from "../Layouts/HomeLayout";
import { createAccount } from "../Redux/Slices/AuthSlice";

function Signup() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [previewImage,setPreviewImage] = useState("")

    const [signupData, setSignupData] = useState({
        fullName : "",
        email : "",
        password : "",
        avatar : ""
    })
    const handleUserInput = (e)=>{
        const {name,value} = e.target;
        setSignupData({
            ...signupData,
            [name] : value
        })
    };

    function getImage(event) {
        event.preventDefault();
        const uploadImage = event.target.files[0];

        if (uploadImage) {
            setSignupData({
                ...signupData,
                avatar : uploadImage
            });
        }
        const fileReader = new FileReader()
        fileReader.readAsDataURL(uploadImage);
        fileReader.addEventListener('load',()=>{
            setPreviewImage(fileReader.result)
        })
    }

    async function createNewAccount(event) {
       event.preventDefault();
       if(!signupData.fullName || !signupData.email || !signupData.password || !signupData.avatar){
        toast.error('Please fill all the details');
        return;
        //checkin full name length
       }
       if(signupData.fullName.length < 8){
        toast.error('Name should be atleast 8 charactors')
        return;
       }
       //checking valid email
       if(!validEmail(signupData.email)){
        toast.error('Please provide a valid email')
        return;
       }
       //checking for valid password
       if (!validPassword(signupData.password)) {
        toast.error('password must contain one special character one digit and between 8-16 characters long')
        return;
       }

       const formData = new FormData();
       formData.append('fullName',signupData.fullName)
       formData.append('email',signupData.email)
       formData.append('password',signupData.password)
       formData.append('avatar',signupData.avatar)
    // dispatch create account action
       const response = await dispatch(createAccount(formData));
       console.log(response);
       if(response?.payload?.success)
           navigate('/');
       
       setSignupData({
        fullName : "",
        email : "",
        password : "",
        avatar : ""
       })
       setPreviewImage("")
    }
    
    return(
        <HomeLayout>
            <div className="flex items-center justify-center h-[90vh]">
            <form noValidate onSubmit={createNewAccount} className="flex flex-col justify-center gap-3 rounded-lg p-4 text-white w-96 shadow-[0_0_10px_black]">
               <h1 className="text-center text-2xl font-bold">
                Resistration Page
                </h1>
                <label htmlFor="image_uploads" className="cursor-pointer">
                  {previewImage ?
                  (<img className="w-24 h-24 rounded-full m-auto" src={previewImage}/>) : 
                    <BsPersonCircle className="w-24 h-24 rounded-full m-auto"/>
                  }  
                </label>
                <input 
                    onChange={getImage}
                    type="file" 
                    className="hidden"
                    id="image_uploads"
                    accept=".jpg, .jpeg, .png, .svg"
                />
                <div className="flex flex-col gap-1">
                  <label htmlFor="fullName" className="font-semibold">Full Name</label>
                  <input type="text" required name="fullName" id="fullName" placeholder="Enter your Full name.." className="bg-transparent px-2 py-1 border"
                  onChange={handleUserInput}
                  value={signupData.fullName}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="email" className="font-semibold">Email</label>
                  <input type="email" required name="email" id="email" placeholder="Enter your email.." className="bg-transparent px-2 py-1 border"
                  onChange={handleUserInput}
                  value={signupData.email}/>
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="password" className="font-semibold">Password</label>
                  <input type="password" required name="password" id="password" placeholder="Enter your password.." className="bg-transparent px-2 py-1 border"
                  onChange={handleUserInput}
                  value={signupData.password}/>
                </div>
                <button type="submit" className="bg-yellow-600 hover:bg-yellow-500 py-1 mt-2 transition-all ease-in-out duration-300 rounded-lg font-semibold text-lg cursor-pointer">
                    Create Account
                </button>
                <p className="text-center">
                    Already heve an account ? <Link to='/login' className="link text-accent">Login</Link>
                </p>
            </form>
            </div>
        </HomeLayout>
    )
}

export default Signup;