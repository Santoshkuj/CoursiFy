import './App.css'

import { Route, Routes } from 'react-router-dom'

import RequireAuth from './Components/RequireAuth.jsx'
import AboutUs from './Pages/AboutUs.jsx'
import Changepassword from './Pages/ChangePassword.jsx'
import Contact from './Pages/Contact.jsx'
import CourseDescription from './Pages/Courses/CourseDescription.jsx'
import CourseList from './Pages/Courses/CourseList.jsx'
import CreateCourse from './Pages/Courses/CreateCourse.jsx'
import AddLecture from './Pages/Dashboard/Addlecture.jsx'
import AdminDashboard from './Pages/Dashboard/AdminDashboard.jsx'
import Displaylectures from './Pages/Dashboard/Displaylectures.jsx'
import Denied from './Pages/Denied.jsx'
import HomePage from './Pages/HomePage.jsx'
import Login from './Pages/Login.jsx'
import NotFound from './Pages/NotFound.jsx'
import Checkout from './Pages/Payments/Checkout.jsx'
import CheckoutFail from './Pages/Payments/CheckoutFail.jsx'
import CheckoutSuccess from './Pages/Payments/CheckoutSuccess.jsx'
import Signup from './Pages/Signup.jsx'
import EditProfile from './Pages/User/EditProfile.jsx'
import { UserProfile } from './Pages/User/UserProfile.jsx'
function App() {

  return (
    <Routes>
      <Route path='/' element={<HomePage/>}/>
      <Route path='/about' element={<AboutUs/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/courses' element={<CourseList/>}/>
      <Route path='/courses/description' element={<CourseDescription/>}/>
      <Route path='/contact' element={<Contact/>}/>
      <Route path='/denied' element={<Denied/>}/>
      <Route path='*' element={<NotFound/>}/>
      <Route path='/checkout/fail' element={<CheckoutFail/>}/>

      <Route element= {<RequireAuth allowedRoles={['ADMIN']}/>}>
        <Route path='/course/create' element={<CreateCourse/>}/>
        <Route path='/lecture/addnewlecture' element={<AddLecture/>}/>
        <Route path='/admin/dashboard' element={<AdminDashboard/>}/>
      </Route>
      <Route element= {<RequireAuth allowedRoles={['ADMIN','USER']}/>}>
        <Route path='/user/profile' element={<UserProfile/>}/>
        <Route path='/user/editprofile' element={<EditProfile/>}/>
        <Route path='/checkout' element={<Checkout/>}/>
        <Route path='/checkout/success' element={<CheckoutSuccess/>}/>
        <Route path='/course/displaylectures' element={<Displaylectures/>}/>
        <Route path='/changepassword' element={<Changepassword/>}/>
      </Route>
    </Routes>
  )
}

export default App
