import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import HomeLayout from "../../Layouts/HomeLayout";
import { createNewCourse } from "../../Redux/Slices/CourseSlice";

function CreateCourse (){
    const dispatch = useDispatch();
    const naviagte = useNavigate();

    const [userInput,setUserInput] = useState({
        title : "",
        category : "",
        description : "",
        createdBy : "",
        thumbnail : null,
        previewImage : ""
    })

    function handleInput(e){
       const {name,value} = e.target;
       setUserInput({
        ...userInput,
        [name] : value
       })
    }

    function handleImageUpload(e){
        e.preventDefault()
        const uploadImage = e.target.files[0];
        if(uploadImage){
            const fileReader = new FileReader();
            fileReader.readAsDataURL(uploadImage);
            fileReader.addEventListener('load',()=>{
                setUserInput({
                    ...userInput,
                    previewImage : fileReader.result,
                    thumbnail : uploadImage
                })
            });
        }
    }

   async function onFormSubmit(e){
        e.preventDefault();
        if(!userInput.title || !userInput.category || !userInput.createdBy || !userInput.thumbnail || !userInput.description){
            toast.error("All fields are required")
            return
        }

        const response = await dispatch(createNewCourse(userInput));
        if(response?.payload?.success){
            setUserInput({
                title : "",
                category : "",
                description : "",
                createdBy : "",
                thumbnail : null,
                previewImage : ""
            })
            naviagte('/courses')
        }
    }
return(
   <HomeLayout>
    <div className="flex items-center justify-center h-[90vh]">
    <form noValidate
    onSubmit = {onFormSubmit}
    className="flex flex-col justify-center gap-5 rounded-lg p-4 text-white w-[700px] my-10 shadow-[0_0_10px_black] relative"
    >
        <Link to='/admin/dashboard' className="absolute top-6 text-2xl link text-accent cursor-pointer">
        <AiOutlineArrowLeft/>
        </Link>
        <h1 className="text-center text-2xl font-bold">Create New Course</h1>
        <main className="grid grid-cols-2 gap-x-10">
            <div className="gap-y-6">
                <div>
                    <label htmlFor="image_uploads" className="cursor-pointer">
                    {(userInput.previewImage)?(
                        <img className="h-44 w-full m-auto border"
                        src={userInput.previewImage}
                         alt="previevImage" />
                    ):(
                        <div className="w-full h-44 m-auto flex items-center justify-center border">
                            <h1>
                                Upload your course thumbnail
                            </h1>
                        </div>
                    )}
                    </label>
                    <input 
                        className="hidden"
                        name="image_uploads"
                        id="image_uploads"
                        accept=".jpg, .jpeg, .png"
                        onChange={handleImageUpload}
                        type="file"
                        />
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="title" className="text-lg font-semibold">
                        Course title
                    </label>
                    <input type="text"
                        required
                        name="title"
                        id="title"
                        placeholder="Enter course title"
                        className="bg-transparent px-2 py-1 border"
                        onChange={handleInput}
                        value={userInput.title}
                    />
                </div>
            </div>
            <div>
            <div className="flex flex-col gap-1">
                    <label htmlFor="createdBy" className="text-lg font-semibold">
                    Course Instructor :
                    </label>
                    <input type="text"
                        required
                        name="createdBy"
                        id="createdBy"
                        placeholder="Enter course Instructor"
                        className="bg-transparent px-2 py-1 border"
                        onChange={handleInput}
                        value={userInput.createdBy}
                    />
                </div>
            <div className="flex flex-col gap-1">
                    <label htmlFor="category" className="text-lg font-semibold">
                    Course category :
                    </label>
                    <input type="text"
                        required
                        name="category"
                        id="category"
                        placeholder="Enter course category"
                        className="bg-transparent px-2 py-1 border"
                        onChange={handleInput}
                        value={userInput.category}
                    />
                </div>
            <div className="flex flex-col gap-1">
                    <label htmlFor="description" className="text-lg font-semibold">
                    Course description :
                    </label>
                    <textarea
                        required
                        name="description"
                        id="description"
                        placeholder="Enter course description"
                        className="bg-transparent px-2 py-1 border overflow-y-scroll resize-none"
                        onChange={handleInput}
                        value={userInput.description}
                    />
                </div>
                </div>
        </main>
        <button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 py-2 rounded-md text-lg font-semibold cursor-pointer">
            Create Course
        </button>
    </form>
    </div>
   </HomeLayout>
    )
}

export default CreateCourse;