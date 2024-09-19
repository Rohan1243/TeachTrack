import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {useToast} from '@chakra-ui/react';

function ResetPassword() {
  const [ind, setInd] = useState(0);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newpass, setNewPass] = useState("");
  const navigate = useNavigate();

  const toast = useToast();

  axios.defaults.withCredentials = false;

  

  const handleEmail =  async (e) => {
    e.preventDefault();
    if (!email) {
      alert("Please fill all the fields !");
      return;
    }
     axios
      .post("http://localhost:8000/forgotpassword/verifyemail", email)
      .then((res) => {
        if (res.data.data === "verified") {

          toast({
            title: `Sending OTP on your registered Email`,
            status: "success",
            duration: 5000,
            position:"top",
            isClosable: true,
          })

         
          axios
            .get("http://localhost:8000/forgotpassword/sentotp")
            .then((res) => {
                if(res.data.data === "success"){
                  toast({
                    title: `OTP sent successfully on registered Email`,
                    status: "success",
                    duration: 5000,
            position:"top",
                    isClosable: true,
                  })
                    setInd(ind + 1);
                    setEmail("");
                }
            })
            .catch((e) => {
              toast({
                title: `Cannot send OTP! Try Again`,
                status: "error",
                duration: 5000,
            position:"top",
                isClosable: true,
              })
            });
            
            
            
        }
      })
      .catch((e) => {
        toast({
          title: `Please use registered Email!`,
          status: "warning",
          duration: 5000,
            position:"top",
          isClosable: true,
        })
        return ;
      });
  };

  const handleOtp = (e) => {
    e.preventDefault();

    axios.post("http://localhost:8000/forgotpassword/veriftyotp", otp)
    .then((res) => {
        if(res.data.data === "verified"){
          toast({
            title: `OTP verified!`,
            status: "success",
            duration: 5000,
            position:"top",
            isClosable: true,
          })
            setInd(ind+1);
            setOtp();
        }
    })
    .catch((e)=> {
      toast({
        title: `Please Enter Correct OTP`,
        status: "error",
        duration: 5000,
            position:"top",
        isClosable: true,
      })
      return ;
    } )
    
  };

  const handlePassword = (e) => {
    e.preventDefault();
    axios.put("http://localhost:8000/forgorpassword/changepass", newpass)
    .then((res)=> {
        if(res.data.data === "success"){
          toast({
            title: `Password Changed Successfully`,
            status: "success",
            duration: 5000,
            position:"top",
            isClosable: true,
          })
            navigate("/home");
        }
    })
    .catch((e) => {
        
        toast({
          title: `Failed! Try again`,
          status: "error",
          duration: 5000,
            position:"top",
          isClosable: true,
        })
        return ;
    })
  }

  const changeEmail = (e) => {
    setEmail(e.target.value);
  };
  const changeOtp = (e) => {
    setOtp(e.target.value);
  };
  const changeNewPass = (e) => {
    setNewPass(e.target.value);
  };

  var list = [
    {
      name: "Email",
      placeholder: "Enter Email",
      fun: handleEmail,
      inputValue: email,
      onChange: changeEmail,
    },
    {
      name: "Enter Otp",
      placeholder: "Enter Otp",
      fun: handleOtp,
      inputValue: otp,
      onChange: changeOtp,
    },
    {
      name: "New Password",
      placeholder: "Enter New Password",
      fun: handlePassword,
      inputValue: newpass,
      onChange: changeNewPass,
    },
  ];

  return (
    <div className="bg-gradient-to-b from-[#0f172a] to-[#2a364c] flex h-[100vh]">
      <div className="flex flex-row bg-gradient-to-bl from-[#0f172a] to-[#2a364c] mx-auto h-[600px] w-[480px] mt-[40px] justify-center shadow-gray-800 rounded-lg shadow-xl">
        <form className="flex flex-col">
          <div className="flex flex-col justify-center items-center gap-3">
            <div className="flex text-blend justify-center items-center mt-7 text-3xl text-[#d8d8e8] font-bold tracking-wider">
              Reset Password
            </div>
            <div className="w-[90px] mr-2 h-[2px] bg-blue-900 justify-center"></div>
          </div>
          <div className="mt-9 flex flex-col gap-3 w-[420px] text-gray-400">
            <div className="flex flex-col h-[80px]  gap-2">
              <div>
                <label className="text-[15px] pl-3 ">{list[ind].name}</label>
              </div>
              <input
                type="text"
                className="w-[420px] h-[43px] text-[15px] bg-[#2a364c] border-2 border-transparent border-gray-700 rounded-[60px] pl-4"
                placeholder={list[ind].placeholder}
                onChange={list[ind].onChange}
                value={list[ind].inputValue}
              ></input>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center gap-3 mt-[30px]">
            <button
              onClick={list[ind].fun}
              className="w-[190px] h-[40px] bg-green-700 rounded-[10px] shadow-slate-900 shadow-md text-[#d8d8e8] text-[20px]"
            >
              {ind < list.length - 1 ? "Next" : "Submit"}
            </button>
            <a
              className="text-[#d8d8e8] cursor-pointer text-center hover:border-b-2 border-gray-400"
              href="/home"
            >
              Home
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
