import { useEffect, useState } from "react";
import LogoBar from "../LogoBar/LogoBar";
import SideBar from "../LogoBar/sideBar";
import axios from "axios";
import * as XLSX from "xlsx";
import ttf from "../assets/xl_files/tt68.xlsx";
import td from "../assets/xl_files/teachersdetails.xlsx";
import tdp from "../assets/xl_files/teachers2.xlsx";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
// import Input, {
//   TeacherDetailInput,
//   TeacherPastExperience,
// } from "../controllers/input";

export default function AllInput({ role }) {
  // TEACHER DETAIL LOGIC

  const [tdetails, settdetails] = useState({});
  const toast = useToast();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("details"));
    console.log(data);
    settdetails(data);
  }, []);

  const [Tfile, selectTFile] = useState(null);
  const [finalarray, setFinalArray] = useState([]);

  const handleTFileChange = (event) => {
    selectTFile(event.target.files[0]);
  };

  const handleSignup = () => {
    axios
      .get("http://localhost:8000/signup")
      .then((res) => {
        // handle response if needed
        if (res.data.data === "success") {
          toast({
            title: "Sign Up success",
            status: "success",
            duration: 5000,
            position: "top",
            isClosable: true,
          });
        }
      })
      .catch((e) => {
        toast({
          title: "Error in Signing Up! Upload the file Again",
          status: "error",
          duration: 5000,
          position: "top",
          isClosable: true,
        });
      });
  };

  const handleTUpload = () => {
    if (!Tfile) {
      console.error("No file selected");
      return;
    }
    const reader = new FileReader();

    reader.onload = function (event) {
      TparseExcelToJson(event.target.result);
    };

    reader.readAsArrayBuffer(Tfile);
  };

  const TparseExcelToJson = (fileData) => {
    setFinalArray([]);
    const data = new Uint8Array(fileData);
    const workbook = XLSX.read(data, { type: "array" });

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    try {
      if (jsonData.length <= 1) {
        console.log("Empty File");
        return;
      }
      let newArray = [];
      for (let key in jsonData) {
        if (key !== "0") {
          let newobj = {
            name: jsonData[key][0],
            email: jsonData[key][1],
            phone: jsonData[key][2],
          };
          newArray.push(newobj);
        }
      }
      setFinalArray(newArray);
      uploadDetails(newArray);
    } catch (e) {
      console.error(e);
    }
  };

  const uploadDetails = (details) => {
    axios
      .post("http://localhost:8000/inputs/teacherDetails", details)
      .then((response) => {
        if (response.data.data === "success") {
          toast({
            title: "Details Uploaded Successfully",
            status: "success",
            duration: 5000,
            position: "top",
            isClosable: true,
          });

          handleSignup();
        }
      })
      .catch((error) => {
        toast({
          title: "Failed to Upload details! Try Again",
          status: "error",
          duration: 5000,
          position: "top",
          isClosable: true,
        });
      });
  };

  // TEACHER DETAIL LOGIC END

  // TIME TABLE UPLOAD LOGIC

  const [selectedFile, setSelectedFile] = useState(null);
  const [newStaffObject, setStaffObj] = useState(null);
  var [ind, setInd] = useState(0);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  const handleUpload = () => {
    if (!selectedFile) {
      console.error("No file selected");
      return;
    }

    // Create a new file reader instance
    const reader = new FileReader();

    // Define the onload event handler
    reader.onload = function (event) {
      parseExcelToJson(event.target.result); // Call function to parse Excel file
    };

    // Read the selected file as binary string
    reader.readAsArrayBuffer(selectedFile);
    setInd(ind++);
  };
  let staffObj = {};
  const parseExcelToJson = (fileData) => {
    // Parse the Excel file
    const data = new Uint8Array(fileData);
    const workbook = XLSX.read(data, { type: "array" });

    // Convert the first sheet of the workbook to JSON
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Log the converted JSON data
    console.log("Converted JSON data:", jsonData);

    try {
      let key = 1;
      for (key in jsonData) {
        let teachers = [];
        let sub = "";

        if (jsonData[key][0] === "Subject") {
          key++;
        }
        if (jsonData[key].length === 0) {
          key++;
          key++;
          break;
        }
        sub = jsonData[key][0];
        let staff = "";
        if (jsonData[key][1] === undefined) {
          staff = jsonData[key][2];
        } else {
          staff = jsonData[key][1];
        }

        teachers.push(staff);
        staffObj[sub] = teachers;
      }

      let i;
      let subject;
      for (i = key; i < jsonData.length; i++) {
        let teachers = [];
        if (jsonData[i].length === 1) {
          subject = jsonData[i][0];
        } else {
          // Process teachers data
          while (i < jsonData.length && jsonData[i].length > 1) {
            if (jsonData[i][2] === undefined) {
              teachers.push(jsonData[i][1]);
            } else {
              teachers.push(jsonData[i][2]);
            }

            i++;
          }

          // If teachers array is not empty, add to staffObj
          if (teachers.length > 0) {
            let distinctArr = [...new Set(teachers)];
            if (subject) {
              // Ensure subject is defined before assigning to staffObj
              staffObj[subject] = distinctArr;
            }
          }
          // Decrease the index to handle the current array again
          i--;
        }
      }

      setStaffObj(staffObj);
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }

    axios
      .post("http://localhost:8000/inputs/timetable", staffObj)
      .then((response) => {
        toast({
          title: `TimeTable Uploaded Successfully !`,
          status: "success",
          duration: 5000,
          position: "top",
          isClosable: true,
        });
      })
      .catch((error) => {
        toast({
          title: `Error uploading timetable! Try again`,
          status: "error",
          duration: 5000,
          position: "top",
          isClosable: true,
        });
        return;
      });
  };

  // TIME TABLE UPLOAD LOGIC END

  // PAST DETAILS LOGIC

  const [Pfile, setPFile] = useState(null);
  const [finalobj, setFinalObj] = useState({});

  const handlePfilechange = (event) => {
    setPFile(event.target.files[0]);
  };

  const handlePSubmit = () => {
    if (!Pfile) {
      console.error("No file selected");
      return;
    }
    const reader = new FileReader();

    reader.onload = function (event) {
      PparseExcelToJson(event.target.result);
    };

    reader.readAsArrayBuffer(Pfile);
  };

  const PparseExcelToJson = (fileData) => {
    const data = new Uint8Array(fileData);
    const workbook = XLSX.read(data, { type: "array" });

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    try {
      if (!Pfile) {
        console.log("No file selected !");
        return;
      }

      let key;
      let obj = {};
      for (key in jsonData) {
        if (key != 0) {
          obj[String(jsonData[key][0])] = [];
        }
      }

      let key2;
      for (key2 in jsonData) {
        if (key2 != 0) {
          obj[String(jsonData[key2][0])].push(jsonData[key2][1]);
        }
      }

      setFinalObj(obj);
      console.log(obj)

      axios
        .post("http://localhost:8000/inputs/pastExperienceInput", obj)
        .then((res) => {
          if (res.data.data === "success") {
            toast({
              title: "Details Uploaded Successfully",
              status: "success",
              duration: 5000,
              position: "top",
              isClosable: true,
            });
          }
        })
        .catch((err) => {
          toast({
            title: "Failed to upload details! Try again",
            status: "error",
            duration: 5000,
            position: "top",
            isClosable: true,
          });
        });
    } catch (e) {
      toast({
        title: "Failed to upload details! Try again",
        status: "error",
        duration: 5000,
        position: "top",
        isClosable: true,
      });
    }
  };

  // PAST DETAILS LOGIC END
  const navigate = useNavigate();
  function handleTDetails() {
    if (ind === 2) {
      localStorage.setItem("clicked", "home");
      navigate("/home");
    } else {
      setInd(ind + 1);
    }
  }
  const info = [
    {
      title: "Teacher Details",
      instr: ["Instruction 1", "Instruction2", "INstruction3"],
      filename: td,
      nextHandle: handleTDetails,
      uploadchange: handleTFileChange,
      uploadBtn: handleTUpload,
      label: "Upload teacher details file: ",
    },
    {
      title: "Time Table",
      instr: ["Instruction 1", "Instruction2", "INstruction3"],
      filename: ttf,
      nextHandle: handleTDetails,
      uploadchange: handleFileChange,
      uploadBtn: handleUpload,
      label: "Upload timetable: ",
    },
    {
      title: "Teacher Past Details",
      instr: ["Instruction 1", "Instruction2", "INstruction3"],
      filename: tdp,
      nextHandle: handleTDetails,
      uploadchange: handlePfilechange,
      uploadBtn: handlePSubmit,
      label: "Upload previously taught subject file: ",
    },
  ];

  return (
    <div className="flex flex-col fixed">
      <LogoBar teacherDetails={tdetails} />

      <div className="flex ">
        <SideBar role={role} />

        <div className="body ml-[180px] mt-[100px] w-[calc(100vw-180px)] max-w-[calc(100vw-180px)] overflow-hidden text-gray-200">
          <div className="bg-gradient-to-b from-[#0f172a] to-[#2a364c] max-w-[calc(100vw-180px)] h-[calc(100vh-100px)] flex justify-center items-center overflow-hidden">
            <div className="h-[450px] w-[600px] bg-gradient-to-bl from-[#0f172a] to-[#2a364c] shadow-lg rounded-lg">
              <div className="flex justify-center mt-3 text-2xl font-bold ">
                {info[ind].title}
              </div>
              <br />
              <hr />
              <h1 className="font-bold text-lg mb-3 pl-[20px]">
                Instructions :-{" "}
              </h1>
              <div className="pl-[20px]">
                {info[ind].instr.map((a) => {
                  return <div>{a}</div>;
                })}

                <div className="">
                  Format:{" "}
                  <span className="pl-[5px]">
                    <a
                      href={info[ind].filename}
                      download={info[ind].filename}
                      className="text-blue-600"
                    >
                      Click to Download Format
                    </a>
                  </span>
                </div>
              </div>
              <br />
              <hr />

              <div className="mt-3">
                <div className="pl-[20px] flex  ">
                  <div className="flex flex-col gap-2 ">
                    <div className="flex gap-y-3 gap-7 ">
                      <label className="text-lg font-medium mt-2">
                        {info[ind].label}
                      </label>
                      <div className="flex justify-center items-center gap-5">
                        <div>
                          <input
                            type="file"
                            onChange={info[ind].uploadchange}
                            className="appearance-none bg-transparent border border-gray-300 rounded py-2 px-4 text-transparent leading-tight focus:outline-none focus:border-blue-500 w-[130px]"
                          ></input>
                        </div>
                        <div className="">
                          <button
                            onClick={info[ind].uploadBtn}
                            className="mr-[50px] bg-gray-400 w-[70px] h-[30px] text-gray-800 rounded-[5px] hover:opacity-80 transition-all duration-200"
                          >
                            Upload
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <br />
                <hr />
                <div className="mt-[40px] ml-[20px] flex justify-center h-[70px]">
                  <button
                    onClick={info[ind].nextHandle}
                    className=" bg-green-400 hover:opacity-70 transition-all duration-150 w-[100px] h-[40px] rounded-lg mr-3 text-gray-800"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#0f172a] to-[#2a364c] w-[calc(98.93vw-180px)] h-[100vh] text-white"></div>
        </div>
      </div>
    </div>
  );
}
