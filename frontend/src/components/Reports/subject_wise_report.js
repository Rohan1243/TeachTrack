import React, { useEffect, useState } from "react";
import pict_logo from "../assets/logo/pict_removed.png";

export default function Subject_wise_report() {
  const [formData, setFormData] = useState(null);
  // var [size, setSize] = useState(0);

  useEffect(() => {
    // Retrieve form data from local storage
    const storedFormData = localStorage.getItem("formData");
    console.log(`Recieved Data: ${storedFormData}`);
    // console.log("Stored form data:", storedFormData);
    if (storedFormData) {
      const parsedFormData = JSON.parse(storedFormData);
      console.log(parsedFormData);
      setFormData(parsedFormData);
      // Calculate the number of objects in the array
      // setSize(parsedFormData.length);
      // Clear stored form data
      localStorage.removeItem("formData");
    }
  }, []);
  // const [subjectName, teachers] = Object.entries(formData[size-1])[0];
  // console.log(teachers);
  if (!formData) {
    return (
      <div>Loading...</div> // Or your loading/fallback component
    );
  }
  // Now that formData is guaranteed to be non-null, calculate size here
  const size = formData.length;

  // Access the last object now that we're sure formData is available

  const lastObject = formData[size - 1];
  const [subjectName, teachers] = lastObject
    ? Object.entries(lastObject)[0]
    : [null, []];

  const handleDownload = () => {
    window.print();
  };

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(today.getDate()).padStart(2, "0");
  return formData ? (
    <div className="flex flex-col">
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
          <div className="font-bold text-[19px] ml-[75px]">PAQIC Report</div>
          <div className="font-bold text-[16px] ml-[85px]">(Course wise)</div>
        </div>

        <div className="flex text-[16px] font-bold gap-[130px]  mb-3">
          {/* year sem and date */}
          <div className="">Academic Year: </div>
          <div>SEM: </div>
          <div>Date: </div>
        </div>

        <div>
          {/* main data */}

          <div className="w-[550px]  min-h-[500px]  border-black border pl-[70px] flex-col">
            <div className="w-[550px]  border-b pl-3 min-h-[40px] -ml-[70px] border-black font-bold text-lg">
              Course Name : {Object.keys(formData[size - 1])[0]}
            </div>
            <div className="w-[550px]  border-b pl-3 min-h-[40px] -ml-[70px] border-black font-bold text-lg ">
              Course Coordinator{" "}
              <span className="font-normal text-base">
                {formData[size - 2].subcoordinator}
              </span>
            </div>
            <div className="w-[550px]  border-b pl-3 min-h-[100px] -ml-[70px] border-black font-bold text-lg">
              Course teachers Name & Signature <br />
              {subjectName && (
                <div className="font-normal text-base">
                  {teachers.length > 0 ? (
                    <ul>
                      {teachers.map((teacher, index) => (
                        <li key={index}>{teacher}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No teachers listed for this subject.</p>
                  )}
                </div>
              )}
            </div>
            <div className="w-[550px]  border-b pl-3 min-h-[140px] -ml-[70px] border-black font-bold text-lg">
              Overall observations on academic audit:
              <br />
              {formData.map((a, ind) => {
                if (
                  a.remark !== "" &&
                  ind !== 0 &&
                  ind != size - 1 &&
                  ind != size - 2 &&
                  ind != size - 3 &&
                  a.remark !== "NA"
                ) {
                  // console.log(`${Object.keys(a)[0]} : ${a.remark} `);
                  return (
                    <React.Fragment key={ind}>
                      <span className="text-base font-normal">
                        {Object.keys(a)[0]} has {a.remark}.
                      </span>
                    </React.Fragment>
                  );
                }
              })}
            </div>
            <div className="w-[550px]  pl-3 min-h-[180px] -ml-[70px] border-black font-bold text-lg">
              Action taken on previous academic audit observations/suggestions:
              <br />
              <span className="font-normal text-base">
                {formData[size - 3].previous}
              </span>
            </div>
          </div>
        </div>

        <div>
          {/* Signature */}
          <br />
          <br />
          <br />
          <div className="mr-[220px] font-semibold text-lg">
            Auditor Name & Signature
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
  ) : (
    <div className="flex flex-col">
      <div className="flex flex-col pt-[90px]  w-screen min-h-screen items-center">
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
          <div className="font-bold text-[19px] ml-[75px]">PAQIC Report</div>
          <div className="font-bold text-[16px] ml-[85px]">(Course wise)</div>
        </div>

        <div className="flex text-[16px] font-bold gap-[130px]  mb-3">
          {/* year sem and date */}
          <div className="">Academic Year: </div>
          <div>SEM: </div>
          <div>Date: {day}/{month}/{year}</div>
        </div>

        <div>
          {/* main data */}

          <div className="w-[550px]  min-h-[500px]  border-black border pl-[70px] flex-col">
            <div className="w-[550px]  border-b pl-3 min-h-[40px] -ml-[70px] border-black font-bold text-lg">
              Course Name{" "}
            </div>
            <div className="w-[550px]  border-b pl-3 min-h-[40px] -ml-[70px] border-black font-bold text-lg ">
              Course Coordinator
            </div>
            <div className="w-[550px]  border-b pl-3 min-h-[100px] -ml-[70px] border-black font-bold text-lg">
              Course teachers Name & Signature
            </div>
            <div className="w-[550px]  border-b pl-3 min-h-[140px] -ml-[70px] border-black font-bold text-lg">
              Overall observations on academic audit:
            </div>
            <div className="w-[550px]  pl-3 min-h-[180px] -ml-[70px] border-black font-bold text-lg">
              Action taken on previous academic audit observations/suggestions:
              <br />
              <span></span>
            </div>
          </div>
        </div>

        <div>
          {/* Signature */}
          <br />
          <br />
          <br />
          <div className="mr-[220px] font-semibold text-lg">
            Auditor Name & Signature
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
  );
}
