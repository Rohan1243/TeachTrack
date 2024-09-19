import React, { useEffect, useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import InputIcon from "@mui/icons-material/Input";
import MailIcon from "@mui/icons-material/Mail";
import DescriptionIcon from "@mui/icons-material/Description";
import SettingsIcon from "@mui/icons-material/Settings";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SideBar({ role }) {
  const navigate = useNavigate();

  const item = localStorage.getItem("clicked");
  let item2;

  if (item === undefined) {
    item2 = "home";
  } else {
    item2 = item;
  }

  const [clicked, setClicked] = useState(item2);

  // useEffect()

  const handleInput = async () => {
    setClicked("input");
    localStorage.setItem("clicked", "input");
    navigate("/home/inputs");
  };
  const handleMail = async () => {
    setClicked("mail");
    localStorage.setItem("clicked", "mail");
    navigate("/home/mailauditor");
  };
  const handleHome = async () => {
    setClicked("home");
    localStorage.setItem("clicked", "home");
    navigate("/home");
  };
  const handleForm = () => {
    navigate("/auditor/form");
  }
  const reportHandler = async () => {
    setClicked("reportHandler");
    localStorage.setItem("clicked", "reportHandler");
    navigate("/consolidated/report");
  };

  const sheetHandler = () => {
    axios({
      url: "http://localhost:8000/auditsheet",
      method: "GET",
      responseType: "blob",
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "PAQIC_Audit.xlsx"); // Set the desired file name
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log("Sheet downloaded successfully");
      })
      .catch((e) => {
        console.error(e);
      });
  };

  useEffect(() => {
    console.log(role);
  },[])

  return (
    <div className="flex justify-start ">
      <div className="flex flex-col justify-center fixed w-[180px] bg-[#0f172a] mt-[100px] min-h-[calc(100vh-100px)] items-center text-white gap-[25px] border-r-2  border-gray-700">
        <div
          className={`border border-transparent hover:bg-white w-[160px] h-[50px] flex justify-center items-center gap-6 rounded-[10px] transition-all duration-150 hover:text-black cursor-pointer pr-11 ${
            clicked === "home" ? "bg-white text-black" : "bg-[#0f172a]"
          }`}
          onClick={handleHome}
        >
          {" "}
          <HomeIcon />
          <button>Home</button>
        </div>
        {role==='auditor' && <div
          className={`border border-transparent hover:bg-white w-[160px] h-[50px] flex justify-center items-center gap-4 pl-3 rounded-[10px] transition-all duration-150 hover:text-black cursor-pointer pr-11 ${
            clicked === "home" ? "bg-white text-black" : "bg-[#0f172a]"
          }`}
          onClick={handleForm}
        >
          {" "}
          <DescriptionIcon />
          <button>Audit Form</button>
        </div>}

        {role === 'coordinator' && <div
          className={`border border-transparent hover:bg-white w-[160px] h-[50px] flex justify-center rounded-[10px] transition-all duration-150 hover:text-black cursor-pointer items-center gap-6 pr-11 ${
            clicked === "input" ? "bg-white text-black" : "bg-[#0f172a]"
          }`}
          onClick={handleInput}
        >
          <InputIcon />
          <button>Inputs</button>
        </div>}

        {role=== 'coordinator' &&  <div
          className={`border border-transparent hover:bg-white w-[160px] h-[50px] flex justify-center rounded-[10px] transition-all duration-150 hover:text-black cursor-pointer items-center gap-6 pr-14 ${
            clicked === "mail" ? "bg-white text-black" : "bg-[#0f172a]"
          }`}
          onClick={handleMail}
        >
          <MailIcon />
          <button>Mail</button>
        </div>}

       {role==='coordinator' && <div className="border border-transparent hover:bg-white w-[160px] h-[50px] flex justify-center rounded-[10px] transition-all duration-150 hover:text-black cursor-pointer items-center gap-4 pr-11">
          <DescriptionIcon />
          <button
            className="flex flex-col justify-center items-center"
            onClick={reportHandler}
          >
            <div>View</div>
            <div>Reports</div>
          </button>
        </div>}
        {role==='coordinator' && <div className="border border-transparent hover:bg-white w-[160px] h-[50px] flex justify-center rounded-[10px] transition-all duration-150 hover:text-black cursor-pointer items-center gap-4 pr-11">
          <DescriptionIcon />
          <button
            className="flex flex-col justify-center items-center"
            onClick={sheetHandler}
          >
            <div>Audit</div>
            <div>Sheet</div>
          </button>
        </div>}

        {/* <div className="border border-transparent hover:bg-white w-[160px] h-[50px] flex justify-center rounded-[10px] transition-all duration-150 hover:text-black cursor-pointer items-center gap-4 pr-12">
          <SettingsIcon  />
          <button className="cursor-pointer">Settings</button>
        </div> */}

        {role === 'coordinator' && <div className="border border-transparent hover:bg-white w-[160px] h-[50px] flex justify-center rounded-[10px] transition-all duration-150 hover:text-black cursor-pointer items-center gap-4 pr-12">
          <SwapHorizIcon />
          <button className="flex flex-col justify-center items-center">
            <div>Change</div>
            <div>Access</div>
          </button>
        </div>}
      </div>
    </div>
  );
}

export default SideBar;
