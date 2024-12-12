import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './components/Home.jsx'
import HomeStudent from './components/HomeStudent.jsx'
import About from './components/About.jsx'
import Contact from './components/Contact.jsx'
import ToLogin from './components/ToLogin.jsx'
import StudentDetail from './components/StudentDetail.jsx'
import UserGreeting from './components/UserGreeting.jsx'
import CreateCourse from "./components/CreateCourse";
import ViewCourses from "./components/ViewCourses";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

function App() {

  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<ToLogin />} />
          <Route path='/home' element={<Home />} />
          <Route path='home-student' element={<HomeStudent />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path="/create-course" element={<CreateCourse />} />
          <Route path="/view-courses" element={<ViewCourses />} />
        </Routes>
        <Footer />
      </div>
    </Router>

  )
}

export default App
