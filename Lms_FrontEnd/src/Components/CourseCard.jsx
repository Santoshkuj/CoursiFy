import { useNavigate } from "react-router-dom";

function CourseCard({data}) {
    const navigate = useNavigate();
    return(
        <div onClick={()=>navigate('/courses/description',{state :{...data}})}
            className="text-white w-[22rem] h-[420px] shadow-lg cursor-pointer group overflow-hidden bg-zinc-700">
          <div className="overflow-hidden">
            <img 
            className="h-48 w-full rounded-tl-lg rounded-tr-lg group-hover:scale-[1.1] transition-all ease-in-out duration-300"
            src={data?.thumbnail?.public_url} 
            alt="Course thumbnail" />
            <div className="p-3 space-y-1 text-white">
                <h2 className="text-xl font-bold text-yellow-500 line-clamp-2">
                    {data?.title}
                </h2>
                <p className="line-clamp-2">
                    {data?.description}
                </p>
                <p>
                    <span className="text-yellow-500 font-bold">Category : </span>
                    {data?.category}
                </p>
                <p>
                    <span className="text-yellow-500 font-bold">Total lectures : </span>
                    {data?.numbersOfLectures}
                </p>
                <p>
                    <span className="text-yellow-500 font-bold">Instructor : </span>
                    {data?.createdBy}
                </p>
            </div>
        </div>  
        </div>
    )
}

export default CourseCard;