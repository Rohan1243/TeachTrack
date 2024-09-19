import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

function SignUp() {

    const [data, setData] = useState({
        name: '',
        email:'',
        password:'',
        secret_key: ''
    });

    const navigate = useNavigate();

    // const handleSubmit = (event) => {
    //     event.preventDefault();
    //     axios.post('http://localhost:8000/signup', data)
    //     .then(res => {
    //         if(res.data.Status === "Success"){
    //             navigate('/login')
    //         }
    //         if(res.status === 409){
    //             alert("ID ALREADY EXISTS! PLEASE LOGIN.....")
    //             navigate('/login')
    //         }
    //         else{
    //             alert("Error");
    //         }
    //     })
    //     .catch((err) => {
    //         if(err.status === 409){
    //             alert("ID ALREADY EXISTS! PLEASE LOGIN.....")
    //             navigate('/login')
    //         }
    //     })
    // }
    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:8000/signup', data)
        .then(res => {
            // console.log("Response:", res); // Log the entire response object
            if (res.data.Status === "Success") {
                alert("Sign Up Successful");
                navigate('/login');
            } else if (res.status === 404) {
                alert("Not A Teacher from PICT. Please Contact Coordinator");
                navigate('/');

            } 
            else if(res.status === 505){
                alert(res.data.error);
                navigate('/login');
            }
            else {
                
                alert("Error");
            }
        })
        .catch(err => {
            console.error("Error:", err);
            if (err.response.status === 404) {
                alert("Not A Teacher from PICT. Please Contact Coordinator");
                navigate('/');}
            else if(err.response.status === 505){
                alert("User Already Exists Please Login");
                navigate('/login');
            }
        });
    }


    return (
        <div className="bg-gradient-to-b from-[#0f172a] to-[#2a364c] flex h-[100vh]">
            <div className='flex flex-row bg-gradient-to-bl from-[#0f172a] to-[#2a364c] mx-auto h-[600px] w-[480px] mt-[40px] justify-center shadow-gray-800 rounded-lg shadow-xl'>
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <div className='flex flex-col justify-center items-center gap-3'>
                        <div className='flex text-blend justify-center items-center mt-7 text-3xl text-[#d8d8e8] font-bold tracking-wider'>SIGN UP</div>
                        <div className='w-[90px] mr-2 h-[2px] bg-blue-900 justify-center'></div>
                    </div>
                    <div className='mt-9 flex flex-col gap-3 w-[420px] text-gray-400'>
                        <div className='flex flex-col h-[80px] gap-2'>
                            <div>
                                <label className='text-[15px] pl-3 '>FULL NAME</label>
                            </div>
                            <input type='text' className='w-[420px] h-[43px] text-[15px] bg-[#2a364c] border-2 border-transparent border-gray-700 rounded-[60px] pl-4' placeholder='Enter Name' onChange={e=> setData({...data, name:e.target.value})}></input>
                        </div>
                        <div className='flex flex-col h-[80px]  gap-2'>
                            <div>
                                <label className='text-[15px] pl-3 '>EMAIL</label>
                            </div>
                            <input type='text' className='w-[420px] h-[43px] text-[15px] bg-[#2a364c] border-2 border-transparent border-gray-700 rounded-[60px] pl-4' placeholder='Enter Email' onChange={e=> setData({...data, email:e.target.value})}></input>
                        </div>
                        <div className='flex flex-col h-[80px]  gap-2'>
                            <div>
                                <label className='text-[15px] pl-3 '>PASSWORD</label>
                            </div>
                            <input type='text' className='w-[420px] h-[43px] text-[15px] bg-[#2a364c] border-2 border-transparent border-gray-700 rounded-[60px] pl-4' placeholder='Enter Password' onChange={e=> setData({...data, password:e.target.value})}></input>
                        </div>
                        <div className='flex flex-col h-[80px]  gap-2'>
                            <div>
                                <label className='text-[15px] pl-3 '>SECRET KEY</label>
                            </div>
                            <input type='text' className='w-[420px] h-[43px] text-[15px] bg-[#2a364c] border-2 border-transparent border-gray-700 rounded-[60px] pl-4' placeholder='Enter Secret-key' onChange={e=> setData({...data, secret_key:e.target.value})}></input>
                        </div>


                    </div>
                    <div className='flex flex-col justify-center items-center gap-3 mt-[30px]'>
                        <button type="submit" className=' w-[190px] h-[40px] bg-green-700 rounded-[10px] shadow-slate-900 shadow-md text-[#d8d8e8] text-[20px] hover:bg-white hover:text-black'>
                            Submit
                        </button>
                        <a className='text-[#d8d8e8] cursor-pointer text-center hover:border-b-2 border-gray-400' href='/login'>Login</a>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignUp;