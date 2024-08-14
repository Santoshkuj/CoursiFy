import { ArcElement, BarElement,CategoryScale, Chart as ChartJS, Legend, LinearScale, Title,Tooltip} from "chart.js";
import { useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { BsCollectionPlayFill, BsTrash } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { FcSalesPerformance } from "react-icons/fc";
import { GiMoneyStack } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import HomeLayout from "../../Layouts/HomeLayout";
import { deleteCourse, getAllCourses } from "../../Redux/Slices/CourseSlice";
import { getPaymentRecord } from "../../Redux/Slices/RazorpaySlice";
import { getStatsData } from "../../Redux/Slices/StatSlice";

ChartJS.register(ArcElement,CategoryScale,Legend,LinearScale,Title,Tooltip,BarElement)

function AdminDashboard(){
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const {allUserCount, subscribedCount} = useSelector((state)=>state.stats)
    const {allPayments, monthlySalesRecord} = useSelector((state)=>state.razorpay)
    
    const userData = {
        labels: ["Registered User","Enrolled User"],
        fontColor : 'White',
        datasets : [
            {
                label : "User Details",
                // data : [allUserCount,subscribedCount],
                data : [64,16],
                backgroundColor : ['yellow','green'],
                borderWidth : 1,
                borderColor: ['yellow','green']
            }
        ]
    }

    const salesData = {
        labels : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        fontColor : 'white',
        datasets : [
            {
                label : 'Sales/Month',
                // data : monthlySalesRecord,
                data : [3,1,2,4,1,2,1,1,2,3,1,2],
                backgroundColor : ['rgb(255,99,132)'],
                borderColor : ['white'],
                borderWidth : 2
            }
        ]
    }
    const myCourses = useSelector((state)=>state?.course?.courseData)

    async function onCourseDelete(id){
        if(window.confirm('Are you sure you want to delete the course ?')){
            const res = await dispatch(deleteCourse(id));
            if(res?.payload?.success){
                await dispatch(getAllCourses())
            }
        }
    }
    useEffect(()=>{
        (
            async () =>{
                await dispatch(getAllCourses())
                await dispatch(getStatsData())
                // await dispatch(getPaymentRecord())
            }
        )()
    },[])
    return(
        <HomeLayout>
            <div className="min-h-[90vh] pt-5 flex flex-col flex-wrap gap-10 text-white">
            <h1 className="text-center text-5xl font-semibold text-yellow-500">
                    Admin Dashboard
            </h1>
            <div className="grid grid-cols-2 gap-5 m-auto mx-10">
                <div className="flex flex-col items-center gap-10 p-5 shadow-lg rounded-md">
                    <div className="w-80 h-80">
                        <Pie data={userData}/>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                        <div className="flex items-center justify-between p-5 gap-5 rounded-md shadow">
                            <div className="flex flex-col items-center">
                            <p className="font-semibold">Registered Users</p>
                            <h3>64</h3>
                            </div>
                            <FaUsers className="text-yellow-500 text-5xl min-h-8"/>
                        </div>
                        <div className="flex items-center justify-between p-5 gap-5 rounded-md shadow">
                            <div className="flex flex-col items-center">
                            <p className="font-semibold">Subscribed Users</p>
                            <h3>16</h3>
                            </div>
                            <FaUsers className="text-green-500 text-5xl min-h-8"/>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-10 p-5 shadow-lg rounded-md">
                    <div className="h-80 w-full relative">
                        <Bar data={salesData} className="absolute bottom-0 h-80 w-80"/>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                        <div className="flex items-center justify-between p-5 gap-5 rounded-md shadow">
                            <div className="flex flex-col items-center">
                            <p className="font-semibold">Subscription Count</p>
                            <h3>16</h3>
                            </div>
                            <FcSalesPerformance className="text-yellow-500 text-5xl min-h-8"/>
                        </div>
                        <div className="flex items-center justify-between p-5 gap-5 rounded-md shadow">
                            <div className="flex flex-col items-center">
                            <p className="font-semibold">Total Revinue</p>
                            <h3>{16*499}</h3>
                            </div>
                            <GiMoneyStack className="text-green-500 text-5xl min-h-8"/>
                        </div>
                    </div>
                </div>
            </div>
            </div>
            <div className="mx-[10%] w-[80%] self-center flex flex-col items-center justify-center gap-10 mb-10">
                <div className="flex w-full items-center justify-between">
                    <h1 className="text-center text-3xl font-semibold">
                        Coursees overview
                    </h1>
                    <button
                    className="w-fit bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded py-2 px-4 font-semibold text-lg cursor-pointer text-white"
                    onClick={()=> navigate('/course/create')}>
                        Create new course
                    </button>
                </div>
                <table className="table overflow-x-scroll">
                    <thead>
                        <tr>
                            <th>Sl.No</th>
                            <th>Course Title</th>
                            <th>Course Category</th>
                            <th>Instructor</th>
                            <th>Totallectures</th>
                            <th>Description</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {myCourses?.map((course,idx)=>{
                            return(
                                <tr key={course._id}>
                                    <td>{idx+1}</td>
                                    <td>{course.title}</td>
                                    <td>{course.category}</td>
                                    <td>{course.createdBy}</td>
                                    <td>{course.numbersOfLectures}</td>
                                    <td className="max-w-40 overflow-hidden text-ellipsis whitespace-nowrap ">
                                        <textarea value={course.description} readOnly className="max-w-40 h-auto bg-transparent resize-none outline-none"></textarea>
                                    </td>
                                    <td className="flex items-center gap-4">
                                        <button 
                                        className="bg-green-600 hover:bg-green-500 transition-all ease-in-out duration-300 py-2 px-4 rounded-md font-bold text-white"
                                        onClick={()=>navigate('/course/displaylectures',{state :{...course}})}>
                                            <BsCollectionPlayFill/>
                                        </button>
                                        <button 
                                        className="bg-red-600 hover:bg-red-500 transition-all ease-in-out duration-300 py-2 px-4 rounded-md font-bold text-white"
                                        onClick={()=>onCourseDelete(course?._id)}>
                                            <BsTrash/>
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </HomeLayout>
    )
}

export default AdminDashboard