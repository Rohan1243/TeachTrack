import React, { useEffect, useState } from 'react'
import image from '../assets/images/landing4.jpg'
// import { TypeAnimation } from 'react-type-animation';
import { useNavigate } from 'react-router-dom';




export default function LandingPage() {
    const TextAnimation = ({ text }) => {
        const [animatedText, setAnimatedText] = useState('');
      
        useEffect(() => {
          if (text) {
            let index = 0;
            const interval = setInterval(() => {
              setAnimatedText(prevText => {
                // Check if index is within the bounds of the text array
                if (index < text.length) {
                  return prevText + text[index];
                } else {
                  // Clear the interval if index exceeds the length of the text array
                  clearInterval(interval);
                  return prevText;
                }
              });
              index++;
            }, 100); // Adjust the interval speed as needed
      
            // Clean up the interval on component unmount
            return () => clearInterval(interval);
          }
        }, [text]);
      
        return <span className='text-yellow-400'>{animatedText}</span>;
      };

    const navigate  = useNavigate();

    // function handleSignUp() {
    //     navigate('/signup')
    // }
    function handleLogin() {
        navigate('/login')
    }
  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen bg-gradient-to-br from-[#0f172a] to-[#2a364c] text-white ">
      <div className="flex flex-row w-[1300px] h-[600px] border border-transparent rounded-lg shadow-xl shadow-gray-800">
        <div className="flex flex-col justify-around items-start z-20  ">
          <div className="flex flex-col justify-evenly  h-[400px] w-[500px] pl-12">
            
            <h2 className="text-[48px] w-[700px] font-custom"> {/*<span className='text-gray-300'>WELCOME TO</span> <span className="text-yellow-600">PAQIC AUDIT</span>*/}

            Welcome to <TextAnimation text="PAAQIC AUDIT." />
              
            </h2>
            <p className='text-[15px] text-justify pl-1 text-gray-400'>
            Welcome to PAQIC Audits, where excellence meets scrutiny. 
            Our audits are meticulously designed to ensure quality standards are met with precision. 
            Experience the pinnacle of quality assurance with our innovative approach. 
            Trust in our rigorous audits to elevate your organization's performance. 
            Join us on a journey of continuous improvement and excellence in every aspect. 
            At PAQIC, we are committed to delivering unparalleled quality assurance solutions.
            </p>
          </div>

          <div className=" flex justify-start gap-[20px] ml-[48px] mb-[40px]">
            {/* <button onClick={handleSignUp} className="h-[40px] w-[150px] text-gray-400 text-[20px] hover:text-slate-100 hover:bg-blue-600 rounded-[12px] shadow-md shadow-slate-900">
              SignUp
            </button> */}
            <button onClick={handleLogin} className="h-[40px] w-[300px] text-gray-400 text-[20px] hover:text-black hover:bg-green-600 rounded-[12px] shadow-md shadow-slate-900 ml-[70px]">
              Login
            </button>
          </div>
        </div>

        <div className=" flex flex-col w-full items-center ">
          <img
            src={image}
            className="h-[600px] z-10 mix-blend-multiply opacity-65 ml-9"
            alt='Background'
          ></img>
          {/* <p  style={{backgroundImage:{image}}}></p> */}
        </div>
      </div>
    </div>
  );
}


