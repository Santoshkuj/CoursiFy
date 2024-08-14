import { AiFillCloseCircle } from "react-icons/ai";
import { FiMenu } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import Footer from "../Components/Footer";
import {logout} from '../Redux/Slices/AuthSlice'
function HomeLayout({children}) {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    // check is user is logged in
    const isLoggedIn = useSelector((state)=>state ?.auth ?.isLoggedin);
    // for displaying the option acc to role
    const role = useSelector((state)=> state ?.auth ?.role)

    function changeWidth() {
        const drawerSide = document.getElementsByClassName('drawer-side');
        drawerSide[0].style.width = 'auto';
    }

    function hideDrawer() {
        const element = document.getElementsByClassName('drawer-toggle')
        element[0].checked = false;
        const drawerSide = document.getElementsByClassName('drawer-side');
        drawerSide[0].style.width = 0;
    }
    async function handleLogout(e) {
        e.preventDefault();
        const res = await dispatch(logout())
        if (res?.payload?.success) {
            navigate('/');
        }
    }

    return(
        <div className="min-h-[90vh] relative">
            <div className="drawer absolute left-0 z-50 w-fit">
                <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                <label htmlFor="my-drawer" className="cursor-pointer relative"> <FiMenu
                                onClick={changeWidth}
                                size={34}
                                className="font-bold text-white m-4"
                                />
                </label>
            </div>
            <div className="drawer-side w-0">
            <label htmlFor="my-drawer" className="drawer-overlay"></label>
            <ul className="menu p-4 w-48 h-[100%] sm:w-80 bg-base-100 text-base-content relative">
                <li className="w-fit absolute right-2 z-50">
                    <button onClick={hideDrawer}>
                        <AiFillCloseCircle size={24}/>
                    </button>
                </li>
                <li>
                 <Link to='/'>Home</Link>   
                </li>
                {isLoggedIn && role === 'ADMIN' &&(
                    <li>
                        <Link to='/admin/dashboard'>Admin DashBoard
                        </Link>
                    </li>
                )}
                {isLoggedIn && role === 'ADMIN' &&(
                    <li>
                        <Link to='/course/create'>Create course
                        </Link>
                    </li>
                )}
                <li>
                 <Link to='/courses'>All Courses</Link>   
                </li>
                <li>
                 <Link to='/about'>About Us</Link>   
                </li>
                {!isLoggedIn &&(
                    <li className="absolute bottom-4 w-[90%]">
                    <div className="w-full flex items-center justify-center">
                        <button className="bg-green-400 px-4 py-1 font-semibold rounded-md w-full text-white">
                            <Link to='/login'>Login</Link>
                        </button>
                        <button className="bg-blue-400 px-4 py-1 font-semibold rounded-md w-full text-white">
                            <Link to='/signup'>SignUp</Link>
                        </button>
                    </div>
                    </li>
                )}
                {isLoggedIn &&(
                    <li className="absolute bottom-4 w-[90%]">
                    <div className="w-full flex items-center justify-center">
                        <button className="bg-green-400 px-4 py-1 font-semibold rounded-md w-full text-white">
                            <Link to='/user/profile'>Profile</Link>
                        </button>
                        <button className="bg-blue-400 px-4 py-1 font-semibold rounded-md w-full text-white">
                            <Link onClick={handleLogout}>Logout</Link>
                        </button>
                    </div>
                    </li>
                )}
            </ul>
            </div>
            </div>
            {children}
            <Footer/>
        </div>
    )
}

export default HomeLayout;