import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import LogoBar from '../LogoBar/LogoBar';
import SideBar from '../LogoBar/sideBar';
import { useToast } from '@chakra-ui/react';

export default function AuditorHome({ role }) {
  const [teacherDetails, setTeacherDetails] = useState(null);

  const toast = useToast();


  async function fetchTeacherDetails() {
    try {
      // Retrieve the token from localStorage (assuming it's stored there after login)
      const token = Cookies.get('token');

      if (!token) {
        console.error('Token not found. User not authenticated.');
        return;
      }

      const response = await fetch(' http://localhost:8000/teacher-details', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Include the token in the request headers
        },
        credentials: 'same-origin' // Include cookies in the request
      });
      const data = await response.json();
      if (response.ok) {
        setTeacherDetails(data.teacher);
      } else {
        toast({
          title: `Error Fetching Details`,
          status: "error",
          duration: 5000,
          position: "top",
          isClosable: true,
        })
      }
    } catch (error) {
      toast({
        title: `Error Fetching Details`,
        status: "error",
        duration: 5000,
        position: "top",
        isClosable: true,
      });

      return;
    }

  }
  useEffect(() => {
    fetchTeacherDetails();
  });

  return (
    <div className="flex flex-col fixed">
      <LogoBar teacherDetails={teacherDetails} />

      <div className="flex ">
        <SideBar role={role} />

        <div className="body mt-[100px] ml-[180px] max-w-[calc(100vw-180px)] relative">
          {/* <div className="bg-gradient-to-br from-blue-500 to-green-500 max-w-[calc(100vw-180px)] h-[100vh] overflow-auto">

            </div> */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] to-[#2a364c] bg-opacity-50 backdrop-blur-lg text-gray-200">
            {/* <h1>Teacher Details</h1> */}
            {teacherDetails ? (
              <div className="">
                <h2 className="font-extrabold text-6xl ml-7 mt-7">Welcome {teacherDetails.name} </h2>



                {/* <p>Email: {teacherDetails.email}</p>
                <p>Subject: {teacherDetails.secret_key}</p> */}
                {/* Add more details as needed */}
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </div>

          <div className="bg-gradient-to-br from-[#0f172a] to-[#2a364c] w-[calc(98.93vw-180px)] h-[100vh] text-white">
            {" "}
          </div>
        </div>
      </div>
    </div>
  );
}


