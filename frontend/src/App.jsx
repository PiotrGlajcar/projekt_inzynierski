import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './components/Home.jsx'
import HomeStudent from './components/HomeStudent.jsx'
import About from './components/About.jsx'
import Contact from './components/Contact.jsx'
import ToLogin from './components/ToLogin.jsx'
import ManageCourse from "./components/ManageCourse.jsx";
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
        <div>
          <Header />
          <Routes>
            <Route path="" element={<ToLogin />} />
            <Route path="/home" element={<ToLogin />} />
            <Route path="/redirect" element={<RedirectPage />} />
            <Route path='/home-staff' element={<Home />} />
            <Route path='/home-student' element={
              <ProtectedRoute role="student">
                <HomeStudent />
              </ProtectedRoute> }/>
            <Route path='/about' element={<About />} />
            <Route path='/contact' element={<Contact />} />
            <Route path="/create-course" element={<CreateCourse />} />
              {/* // <ProtectedRoute role="staff">
              //     <CreateCourse />
              // </ProtectedRoute> */}
            <Route path="/manage-course/" element={<ListCourses />} />
            <Route path="/manage-course/:courseName" element={<ManageCourse />} />
            <Route path="/course-register/" element={<CourseRegister />} />
            <Route path="/course-register/:courseName" element={<CourseRegister />} />
            <Route path="/my-courses" element={<MyCourses />} />
            <Route path="/my-course/:courseName" element={<MyCourseDetails />} />
          </Routes>
          <Footer />
        </div>
      </Router>
  )
}

export default App
