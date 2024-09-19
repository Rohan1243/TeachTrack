import React, { useEffect, useState } from "react";
import Home from "./components/coordinator/home";
import LandingPage from "./components/landingPage/landingPage";
import SignUp from "./components/Auth/signUp";
import Login from "./components/Auth/login";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";
import TeacherHome from "./components/coordinator/teacherHome";
import AuditorHome from "./components/coordinator/auditorHome";
import Input, { SelectAuditor, TeacherPastExperience } from "./components/controllers/input";
import { TeacherDetailInput } from "./components/controllers/input";
import FormComponent from "./components/form/form";
import AllInput from "./components/inputspage/inputpage";
import MailFunc from "./components/mail/mailpage";
import Cookies from "js-cookie";
import Forgotpassword from "./components/Auth/forgotpassword";
import ResetPassword from "./components/Auth/ResetPassword"
import Subject_wise_report from "./components/Reports/subject_wise_report";
import Consolidated_report from "./components/Reports/consolidated_report";
import { ChakraProvider } from "@chakra-ui/react";


function NavigationHandler() {
  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    const token = Cookies.get('token');
    const publicPaths = ['/login', '/signup', '/', '/forgotpassword']; // Add other paths as needed

    if (token) {
      if (location.pathname === '/' || publicPaths.includes(location.pathname)) {
        navigate("/home"); // Redirect to home if on a public path
      }
    } else {
      if (!publicPaths.includes(location.pathname)) {
        navigate("/"); // Redirect to landing page if trying to access protected paths
      }
    }
  }, [navigate, location.pathname]);

  return null;
}



function App() {

  
  
  
  const [role, setUserRole] = useState("");

  const getData = async() => {
    const response  = await axios.get("/home");
    // console.log(response)
    setUserRole(response.data);
  }
  useEffect(()=>{
      getData();
  }, [])


  return (
    <ChakraProvider>
    <Router>
      <Routes>

        <Route path="/" element={<LandingPage />} />
        <Route path="/course_wise/report" element={<Subject_wise_report />} />
        

        
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotpassword" element={<Forgotpassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        {/* <Route path="/home" element={<Home />} /> */}

        
        {role === "coordinator" && (
             
          <>
          <Route path="/home" element={<Home role={role}/>} />
          <Route path="/home/inputs" element={<AllInput role={role}/>} />
          {/* <Route path="/home/inputs/teacher" element={<TeacherDetailInput />} />
          <Route path="/home/inputs/teacher/past" element={<TeacherPastExperience />} /> */}
          <Route path="/home/mailauditor" element={<MailFunc role={role} />} />
          <Route path="/consolidated/report" element={<Consolidated_report />} />

          </>
        )}
        {role === "teacher" && (
          <Route path="/home" element={<TeacherHome role={role}/>} />
        )}
        {role === "auditor" && (
          <>
            <Route path="/home" element={<AuditorHome role={role} />} />
            <Route path="/auditor/form" element={<FormComponent />} />

          </>
          
          
        )}
        
        
        
      </Routes>
      <NavigationHandler />
    </Router>
    </ChakraProvider>
  );
}

export default App;
