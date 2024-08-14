import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { BsPersonCircle } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import HomeLayout from "../../Layouts/HomeLayout";
import { editUserProfile, updateUserData } from "../../Redux/Slices/AuthSlice";

function EditProfile() {
    const userData = useSelector((state)=>state.auth.data);
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const [userInput,setUserInput] = useState({
        fullName : userData.fullName,
        avatar : null,
        previewImage :userData.avatar.secure_url,
        userId : userData?._id
    })

    function handleInput(e){
        e.preventDefault()
        console.log(userInput);
        const {name,value} = e.target;
        setUserInput({
            ...userInput,
            [name] : value
        })
        }
    function handleImageUpload (e){
        const uploadImage = e.target.files[0];
        if(uploadImage){    
            const fileReader = new FileReader()
            fileReader.readAsDataURL(uploadImage)
            fileReader.addEventListener('load',function () {
                setUserInput({
                    ...userInput,
                    previewImage : this.result,
                    avatar : uploadImage
                })
            })
    }
}
    async function onFormSubmit(e){
        e.preventDefault()
        if(!userInput.avatar || !userInput.fullName || !userInput.userId){
            toast.error('All fields are required')
            return;
        }
        const formData = new FormData()
        formData.append('fullName', userInput.fullName)
        formData.append('avatar',userInput.avatar)
        formData.append('userId',userInput.userId)

        const response = await dispatch(editUserProfile(formData))

        await dispatch(updateUserData())

        if(response?.payload?.success){
            setUserInput({
            fullName : "",
            avatar : null,
            previewImage : "",
            userId : ""
            })
            navigate('/user/profile')
        }else{
            return;
        }
    }
    return(
      <HomeLayout>
        <div className="flex items-center justify-center h-[90vh]">
        <form onSubmit={onFormSubmit}
        className="flex flex-col justify-center gap-5 rounded-lg p-4 text-white w-80 min-h-[26rem]"
        >
            <h1 className="text-center text-2xl font-semibold">
                Edit Profile
            </h1>
            <label htmlFor="image_uploads"
            className="cursor-pointer">
                {userInput.previewImage?(
                   <img src={userInput.previewImage} alt="user profile"
                   className="w-28 h-28 rounded-full m-auto" /> 
                ):(
                    <BsPersonCircle
                    className="w-28 h-28 rounded-full m-auto"
                    />
                )}
            </label>
            <input type="file"
            className="hidden"
            id="image_uploads"
            name="image_uploads"
            accept=".png, .jpg, .jpeg ,.svg"
            onChange={handleImageUpload}
            />
            <div className="flex flex-col gap-1">
                <label htmlFor="fullName" className="text-lg font-semibold"> Full Name</label>
                <input type="text" 
                name="fullName"
                id="fullName"
                placeholder="Enter your name"
                className="bg-transparent px-2 py-1 font-semibold"
                onChange={handleInput}
                value={userInput.fullName}
                />
            </div>
            <button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 text-lg cursor-pointer rounded-sm">
                Update profile
            </button>
            <Link to="/user/profile">
                <p className="link text-accent cursor-pointer flex items-center justify-center w-full gap-2">
                <AiOutlineArrowLeft/>Go back to profile
                </p>
            </Link>
        </form>
        </div>
      </HomeLayout>
    )
}

export default EditProfile;