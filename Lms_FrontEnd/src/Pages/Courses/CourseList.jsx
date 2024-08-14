import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import CourseCard from "../../Components/CourseCard";
import HomeLayout from "../../Layouts/HomeLayout";
import { getAllCourses } from "../../Redux/Slices/CourseSlice";

function CourseList() {
 const dispatch = useDispatch();
 const {courseData} = useSelector((state)=>state.course);

 async function LoadCourses(){
    await dispatch(getAllCourses())
 }

 useEffect(()=>{
    LoadCourses()
 },[])

 return(
    <HomeLayout>
        <div className="min-h-[90vh] pt-12 pl-12 flex flex-col gap-10 text-white">
            <h1 className="text-3xl text-center font-semibold mb-5">
                Explore the courses made by {'\u00A0'}
                <span className="font-bold text-yellow-500">
                    Industry experts
                </span>
            </h1>
            <div className="mb-10 flex flex-wrap gap-8 justify-evenly">
                {courseData?.map((element)=>{
                   return <CourseCard key={element._id} data={element}/>
                })}
            </div>
        </div>
    </HomeLayout>
 )
}

export default CourseList;