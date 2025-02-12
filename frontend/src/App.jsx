import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './components/Home.jsx'
import HomeStudent from './components/HomeStudent.jsx'
import About from './components/About.jsx'
import Contact from './components/Contact.jsx'
import ToLogin from './components/ToLogin.jsx'
import Unauthorized from './components/Unauthorized.jsx'
import LoggedOut from './components/LoggedOut.jsx'
import ManageCourse from "./components/ManageCourse.jsx";
import ListCourses from './components/ListCourses.jsx'
import CreateCourse from "./components/CreateCourse.jsx";
import CourseRegister from './components/CourseRegister.jsx'
import RedirectPage from "./components/RedirectPage.jsx";
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import MyCourses from './components/MyCourses.jsx'
import MyCourseDetails from './components/MyCourseDetails.jsx'

function App() {

  return (
      <Router>
        <div className="app-container">
          <Header />
          <div className='content-container'>
          <Routes>
            {/* Public Routes (No Auth Needed) */}
            <Route path="" element={<ToLogin />} />
            <Route path="/home" element={<ToLogin />} />
            <Route path='/about' element={<About />} />
            <Route path='/contact' element={<Contact />} />

            {/* Unauthorized Page */}
            <Route path='/unauthorized' element={<Unauthorized />} />
            <Route path="/redirect" element={<RedirectPage />} />
            <Route path='/logged-out' element={<LoggedOut />} />
            
            {/* Student Routes */}
            <Route path='/home-student' element={
              <ProtectedRoute role="student">
                <HomeStudent />
              </ProtectedRoute> }/>

            <Route path="/my-courses" element={
              <ProtectedRoute role="student">
                <MyCourses />
              </ProtectedRoute> }/>

            <Route path="/my-course/:courseId" element={
              <ProtectedRoute role="student">
                <MyCourseDetails />
              </ProtectedRoute> }/>

            <Route path="/course-register/" element={
              <ProtectedRoute role="student">
                <CourseRegister />
              </ProtectedRoute> }/>

            {/* Teacher Routes */}
            <Route path='/home-staff' element={
              <ProtectedRoute role="teacher">
                <Home />
              </ProtectedRoute> }/>

            <Route path="/create-course" element={
              <ProtectedRoute role="teacher">
                <CreateCourse />
              </ProtectedRoute> }/>

            <Route path="/manage-course/" element={
              <ProtectedRoute role="teacher">
                <ListCourses />
              </ProtectedRoute> }/>

            <Route path="/manage-course/:courseId" element={
              <ProtectedRoute role="teacher">
                <ManageCourse />
              </ProtectedRoute> }/>

            {/* pomocnicza strona do pracy jako prowadzący - DO USUNIĘCIA !!! */}
            <Route path='/home-staff-test' element={<Home />} />
            <Route path="/create-course-test" element={ <CreateCourse />}/>

          </Routes>
          </div>
          <Footer />
        </div>
      </Router>
  )
}

export default App
