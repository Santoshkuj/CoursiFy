import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import HomeLayout from "../../Layouts/HomeLayout";
import { addCourseLecture } from "../../Redux/Slices/LectureSlice";

function AddLecture() {
    const courseDetails = useLocation().state;

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [userInput,setUserInput] = useState({
        id : courseDetails?._id,
        lecture : undefined,
        title : "",
        description : "",
        videoSrc: ""
    })
    function handleInputChange(e) {
        const {name,value} = e.target;
        setUserInput({
            ...userInput,
            [name] : value
        })
    }

    function handleVideo(e) {
        const video = e.target.files[0]
        const sourse = window.URL.createObjectURL(video);
        setUserInput({
            ...userInput,
            lecture : video,
            videoSrc : sourse
        })
    }

    async function onFormSubmit(e) {
        e.preventDefault()
        if(!userInput.lecture || !userInput.title || !userInput.description){
            toast.error('All fields are required')
            return;
        }
        const response = await dispatch(addCourseLecture(userInput));
        if(response?.payload?.success){
            setUserInput({
                id : courseDetails?._id,
                lecture : undefined,
                title : "",
                description : "",
                videoSrc: ""
            })
        }
    }
    useEffect(()=>{
        if(!courseDetails) navigate('/courses')
    },[])
    return(
    <HomeLayout>
        <div className="min-h-[90vh] text-white flex flex-col items-center justify-center gap-10 mx-16">
            <div className="flex flex-col gap-5 p-2 shadow-[0_0_10px_black] w-96 rounded-lg">
                <header className="flex items-center justify-center relative">
                    <button
                    onClick={()=>navigate(-1)} 
                    className="absolute left-2 text-xl text-green-500">
                    <AiOutlineArrowLeft/>
                    </button>
                    <h1 className="text-xl text-yellow-500 font-semibold">
                    Add new lecture
                    </h1>
                </header>
                <form onSubmit={onFormSubmit}
                className="flex flex-col gap-3">

                    <input type="text" 
                        name="title"
                        placeholder="enter title of the course"
                        onChange={handleInputChange}
                        className="bg-transparent py-1 px-3  border"
                        value={userInput.title}
                    />
                    <textarea 
                        name="description"
                        placeholder="enter description of the course"
                        onChange={handleInputChange}
                        className="bg-transparent py-1 px-3 border resize-none overflow-y-scroll h-36"
                        value={userInput.description}
                    />
                    {userInput.videoSrc ?(
                            <video 
                            muted src={userInput.videoSrc} controls
                            controlsList="nodownload" disablePictureInPicture
                            className="object-fill rounded-tl-lg rounded-tr-lg w-full max-h-72">

                            </video>
                        ) :(
                            <div className="h-48 border flex items-center justify-center cursor-pointer">
                                <label htmlFor="lecture"
                                className="font-semibold text-xl cursor-pointer">Choose your video</label>
                                <input type="file" className="hidden"
                                id="lecture" name="lecture" onChange={handleVideo} accept="video/mp4, video/xmp4, video/*"/>
                            </div>
                        )}
                        <button type="submit" className="btn btn-primary py-1 font-semibold text-xl">
                            Add new lecture
                        </button>
                </form>
            </div>
        </div>
    </HomeLayout>
    )
}

export default AddLecture;