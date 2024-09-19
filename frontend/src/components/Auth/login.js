import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {ViewIcon} from '@chakra-ui/icons'
import {ViewOffIcon} from '@chakra-ui/icons'
import {useToast} from '@chakra-ui/react'

function Login() {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const toast = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = (event) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };

  axios.defaults.withCredentials = true;

  const handleLogin = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:8000/login", data)
      .then((res) => {
        if (res.data.Status === "Success") {
          navigate("/home");
          window.location.reload(true);
        } else if (res.data.Error === "Email Does Not Exist") {
          toast({
            title: `Your Not Registered, PLease contact Co-ordinator`,
            status: "error",
            duration: 5000,
            position:"top",
            isClosable: true,
          })
          
        } else if (res.data.Error === "Password Invalid") {
          toast({
            title: `Wrong Password !`,
            status: "error",
            duration: 5000,
            position:"top",
            isClosable: true,
          })
          
        }
      })
      .catch((err) => {
        toast({
          title: `Cannot Login, Try Again`,
          status: "error",
          isClosable: true,
        })
        return ;
        // if(err.data.Error === "Email Does Not Exist"){
        //     alert("Email Does Not Exist ! Please Sign Up First");
        //     navigate('/signup');
        // }
        // if(err.status===404){
        //     alert("Wrong Password! Try Again");
        //     navigate("/login");
        // }
      });
  };

  return (
    <div className="bg-gradient-to-b from-[#0f172a] to-[#2a364c] flex h-[100vh]">
      <div className="flex flex-row bg-gradient-to-bl from-[#0f172a] to-[#2a364c] mx-auto h-[600px] w-[480px] mt-[40px] justify-center shadow-gray-800 rounded-lg shadow-xl">
        <form className="flex flex-col">
          <div className="flex flex-col justify-center items-center gap-3">
            <div className="flex text-blend justify-center items-center mt-7 text-3xl text-[#d8d8e8] font-bold tracking-wider">
              LOGIN
            </div>
            <div className="w-[90px] mr-2 h-[2px] bg-blue-900 justify-center"></div>
          </div>
          <div className="mt-9 flex flex-col gap-3 w-[420px] text-gray-400">
            <div className="flex flex-col h-[80px]  gap-2">
              <div>
                <label className="text-[15px] pl-3 ">EMAIL</label>
              </div>
              <input
                type="text"
                className="w-[420px] h-[43px] text-[15px] bg-[#2a364c] border-2 border-transparent border-gray-700 rounded-[60px] pl-4"
                placeholder="Enter Email"
                onChange={(e) => setData({ ...data, email: e.target.value })}
              ></input>
            </div>
            <div className="flex flex-col h-[80px]  gap-2">
              <div>
                <label className="text-[15px] pl-3 ">PASSWORD</label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-[420px] h-[43px] text-[15px] bg-[#2a364c] border-2 border-transparent border-gray-700 rounded-[60px] pl-4"
                  placeholder="Enter Password"
                  onChange={(e) =>
                    setData({ ...data, password: e.target.value })
                  }
                ></input>
                <button
                  className="absolute right-[20px] top-[4px] text-[20px] text-white"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center gap-3 mt-[30px]">
            <button
              onClick={handleLogin}
              className=" w-[190px] h-[40px] bg-green-700 rounded-[10px] shadow-slate-900 shadow-md text-[#d8d8e8] text-[20px]"
            >
              Submit
            </button>
            <a
              className="text-[#d8d8e8] text-[14px] cursor-pointer text-center hover:border-b-2 border-gray-400"
              href="/forgotpassword"
            >
              Forgot Password ?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
