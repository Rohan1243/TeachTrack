import React, { useEffect, useState } from "react";
import pict_logo from "../assets/logo/pict_removed.png";
import axios from "axios";
import {useToast} from '@chakra-ui/react';

export default function Consolidated_report() {
  const [data, setData] = useState([]);
  const toast = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("/fetchData/consolereport");
      setData(response.data);
    } catch (error) {
      toast({
        title: `Error Fetching Report Data! Try to reload`,
        status: "error",
        isClosable: true,
      })
      return ;
    }
  };

  const handleDownload = () => {
    window.print();
  };
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(today.getDate()).padStart(2, "0");
  return (
    <div className="flex flex-col ">
      <div className="flex flex-col pt-[15px]  w-screen min-h-screen items-center">
        <div className="flex gap-10  px-[100px] mr-10">
          {/* Logo and name of college */}

          <div className="h-[90px] w-[90px]">
            {/* Logo */}
            <img src={pict_logo}></img>
          </div>

          <div className="flex flex-col">
            {/* Name */}
            <div className="text-[17px]">
              Society for Computer Technology and Research’s
            </div>
            <div className="text-[17px] font-semibold ml-[25px]">
              Pune Institute of Computer Technology
            </div>
            <div className="text-[15px] font-semibold  ml-[48px]">
              Department of Computer Engineering
            </div>
          </div>
        </div>

        <div className="mr-10">
          {/* Paqic and course wise*/}
          <div className="font-bold text-[19px] ml-[75px]">
            Consolidated PAQIC Report
          </div>
          <br />
          {/* <div className="font-bold text-[16px] ml-[85px]">(Course wise)</div> */}
        </div>

        <div className="flex text-[16px] font-bold gap-[130px]  mb-3">
          {/* year sem and date */}
          <div className="">Academic Year: </div>
          <div>SEM: </div>
          <div>Date: {day}/{month}/{year}</div>
        </div>

        <div>
          {/* main data */}

          <div className="w-[700px]  min-h-[130px]  border-black border  flex-col">
            <div className="flex justify-start  h-[30px] border-b border-black">
              <div className="w-[60px]  border-r border-black flex justify-center items-center font-bold">
                Sr No.
              </div>
              <div className="w-[140px]  border-r border-black flex justify-center items-center font-bold">
                Course Name
              </div>
              <div className="w-[350px]  border-r border-black flex justify-center items-center font-bold">
                Suggestions Given
              </div>
              <div className="w-[150px] border-black flex justify-center items-center font-bold">
                Status
              </div>
            </div>
            {data.map((a, ind) => {
              return (
                <div className="flex justify-start  h-[100px] border-b border-black">
                  <div className="w-[60px]  border-r border-black flex justify-center items-center">{a.sr}</div>
                  <div className="w-[140px]  border-r border-black flex justify-center items-center">{a.course_name}</div>
                  <div className="w-[350px]  border-r border-black flex justify-center items-center">{a.suggestion}</div>
                  <div className="w-[150px] border-black flex justify-center items-center"></div>
                </div>
              );
            })}
            {/* <div className="flex justify-start  h-[100px] border-b border-black">
              <div className="w-[60px]  border-r border-black flex justify-center items-center"></div>
              <div className="w-[140px]  border-r border-black flex justify-center items-center"></div>
              <div className="w-[350px]  border-r border-black flex justify-center items-center"></div>
              <div className="w-[150px] border-black flex justify-center items-center"></div>
            </div> */}
          </div>
        </div>

        <div>
          {/* Signature */}
          <br />
          <br />
          <br />
          <br />
          <div className="mr-[220px] w-[700px] font-semibold text-lg flex flex-col ml-[220px] pl-[30px] ">
            <div className="flex">
              <div>Paqic Members & Signature</div>
              <div className="ml-[200px]">HoD Name & Signature</div>
            </div>
            <br />

            <div className="text-base">
              Note: This report is to be submitted to IQAC for every semester
              within a week after the
              <br />
              completion of PAQIC audit
            </div>
          </div>
        </div>
        <div className="mt-[90px] mb-[80px] w-screen flex justify-center items-center h-[80px] print:hidden">
          <button
            className="h-[50px] w-[150px] bg-green-400 text-black rounded-2xl"
            onClick={handleDownload}
          >
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
}
