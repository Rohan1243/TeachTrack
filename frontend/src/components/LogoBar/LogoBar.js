// import React, { useState } from "react";
// import logo from "../assets/logo/logo3.png"
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import {ProfileModal} from './ProfileModal.js'

// export default function LogoBar ({teacherDetails}) { 

//     const navigate = useNavigate();
//     const [profileclicked, setProfile] = useState(false)

//     const handleLogout = () => {
//         axios.get('/logout')
//         .then(res => {
//         //   window.location.reload(true);
//             localStorage.clear();
//           navigate("/login");
    
//         })
//     }

//     const handleForgot = () => {
//         navigate("/home/forgotpassword");
//     }
//     const handleLogo = () => {
//         navigate("/home");
//     }
//     const handleProfileModal = () => {
//        <ProfileModal teacherDetails= {teacherDetails} />
//     }
        
//     return(
        
//         <div className="flex justify-around bg-[#0f172a] h-[100px] items-center fixed min-w-[100vw] text-white border-b-2  border-gray-700">


//             <div onClick={handleLogo} className="cursor-pointer">
//                 <img src={logo} alt="Logo" className="w-[400px] h-auto " />
//             </div>

//             {/* <div className="h-[10px] w-[500px] bg-black"></div> */}

            
            
//             <div className="flex ml-auto mr-20 gap-2">
//                 <div className="flex items-center h-9 mr-4 gap-3 pb-1 " >
//                     <AccountCircleIcon />
//                     <div className="mr-2 ml-1">
//                         <button onClick={handleProfileModal}>Profile</button>
//                     </div>
//                 </div>
                
//                 <div className="flex items-center mt-[5px] bg-gray-700 w-0.5 h-6 "></div>


//                 <div className=" flex justify-center items-center ml-3 h-9 w-20 hover:bg-red-600 rounded-[10px] pb-1 cursor-pointer">
//                     <button onClick={handleLogout}>Logout</button>
//                 </div>
                
//             </div>

//         </div>
//     );
// }


import React, { useState } from "react";
import logo from "../assets/logo/logo3.png";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ProfileModal } from './ProfileModal';
import SettingsIcon from '@mui/icons-material/Settings';

export default function LogoBar({ teacherDetails }) {
  const navigate = useNavigate();
  const [isProfileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    axios.get('/logout')
      .then(res => {
        localStorage.clear();
        navigate("/login");
      });
  };

  

  const handleLogo = () => {
    navigate("/home");
  };

  const handleProfileOpen = () => {
    setProfileOpen(true);
  };

  const handleProfileClose = () => {
    setProfileOpen(false);
  };

  return (
    <div className="flex justify-around bg-[#0f172a] h-[100px] items-center fixed min-w-[100vw] text-white border-b-2 border-gray-700">
      <div onClick={handleLogo} className="cursor-pointer">
        <img src={logo} alt="Logo" className="w-[400px] h-auto" />
      </div>
      
      <div className="flex ml-auto mr-20 gap-2">
        <div className="flex items-center h-9 mr-4 gap-3 pb-1 cursor-pointer" onClick={handleProfileOpen}>
          <AccountCircleIcon />
          <div className="mr-2 ml-1">
            <button>Profile</button>
          </div>
        </div>
        
        <div className="flex items-center mt-[5px] bg-gray-700 w-0.5 h-6 mr-2"></div>
        
        <div className="flex justify-center items-center ml-3 h-9 w-20 cursor-pointer">
          <div className="flex flex-row gap-2">
          <SettingsIcon />
          <button>Settings</button>
          </div>
        </div>
      </div>

      <ProfileModal isOpen={isProfileOpen} onClose={handleProfileClose} teacherDetails={teacherDetails} />
    </div>
  );
}
