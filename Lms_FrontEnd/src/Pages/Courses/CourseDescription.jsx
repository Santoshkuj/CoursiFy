import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import HomeLayout from "../../Layouts/HomeLayout";

function CourseDescription() {
   const {state} = useLocation()
   const {data,role} = useSelector((state)=>state.auth)
   const navigate = useNavigate()
    return(
    <HomeLayout>
        <div className="min-h-[90vh] pt-12 px-20 flex flex-col item-center justify-center text-white">
            <div className="grid grid-cols-2 gap-10 p-10 relative">
                <div className="space-y-5">
                    <img src={state?.thumbnail?.public_url}
                        alt="thumbnail"
                        className="w-full h-64"
                     />
                    <div className="space-y-4">
                     <div className="flex flex-col items-center justify-between text-xl">
                        <p className="text-yellow-500 font-semibold">
                            <span>Total lectures : {" "}</span>
                            {state?.numbersOfLectures}
                        </p>
                        <p className="text-yellow-500 font-semibold">
                            <span>Instructor : {" "}</span>
                            {state?.createdBy}
                        </p>
                     </div>
                    {role === "ADMIN" || data?.subscription?.status === "active" ?(
                        <button onClick={()=>navigate('/course/displaylectures',{state :{...state}})} 
                        className="bg-yellow-600 text-xl rounded-md font-bold px-5 py-3 w-full hover:bg-yellow-500 transition-all ease-in-out duration-300">
                            Watch Lectures
                        </button>
                    ) :(
                        <button
                        onClick={()=>navigate('/checkout')}
                        className="bg-yellow-600 text-xl rounded-md font-bold px-5 py-3 w-full hover:bg-yellow-500 transition-all ease-in-out duration-300">
                            Subscribe
                        </button>
                    )}
                    </div>
                </div>
                <div className="space-y-2 text-xl">
                    <h1 className="text-3xl font-bold text-yellow-500 mb-5 text-center">
                        {state?.title}
                    </h1>
                    <p className="text-yellow-500">
                     Course Description :
                    </p>
                    <p>{state?.description}</p>
                </div>
            </div>
        </div>
    </HomeLayout>
    )
}

export default CourseDescription;