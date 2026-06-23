import React, { useContext, useEffect, useState } from 'react'
import assets, { userDummyData } from '../assets/assets.js'
import { useNavigate } from 'react-router-dom'
import { Authcontext } from '../../context/authcontext.jsx';
import { Chatcontext } from '../../context/chatcontext.jsx';

const Leftsidebar = () => {

  const {getusers,users,selecteduser,setselecteduser,unseenmessages,setunseenmessages}= useContext(Chatcontext)

  const {logout,onlineusers}= useContext(Authcontext)
  const[input,setinput]=useState(false)

  const filteredusers= input? users.filter((user)=>user.fullname.toLowerCase().includes(input.toLowerCase())) :users
  const navigate = useNavigate();

  useEffect(()=>{
    getusers();
  },[onlineusers, getusers])

  return (
    <div
      className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${
        selecteduser ? "max-md:hidden" : ""
      }`}
    >
      {/* Navbar */}
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <img src={assets.logo} alt="" className="max-w-40" />
          <div className="relative py-2 group">
            <img
              src={assets.menu_icon}
              alt=""
              className="max-h-5 cursor-pointer"
            />
            <div className="absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block">
              <p
                onClick={() => navigate('/profile')}
                className="cursor-pointer text-sm"
              >
                Edit profile
              </p>
              <hr className="my-2 border-t border-gray-500" />
              <p onClick={()=>logout()} className="cursor-pointer text-sm">Logout</p>
            </div>
          </div>
        </div>


        {/* Search */}
        <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
          <img src={assets.search_icon} alt="Search" className="w-3" />
          <input
            type="text" onChange={(e)=>{setinput(e.target.value)}}
            className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
            placeholder="Search User ..."
          />
        </div>
      </div>



      {/* Users */}
      <div className="flex flex-col">
        {filteredusers.map((user, index) => (
          <div
          onClick={()=>{setselecteduser(user) , setunseenmessages(prev=>({...prev,[user._id]:0})) ;
            console.log(selecteduser)}}
          
            key={index}
            className={`relative flex flex-row items-center gap-4 p-3 mb-3 bg-[#282142] rounded-xl cursor-pointer hover:bg-[#3e3a63] ${selecteduser?._id === user._id ? 'border-2 border-violet-500' : ''}`}
          >
            <img
              className="w-[35px] aspect-[1/1] rounded-full"
              src={user?.profilepic || assets.avatar_icon}
              alt=""
            />
            <div className="flex flex-col leading-5">
              <p>{user.fullname}</p>
              {onlineusers.includes(user._id) ? (
                <span className="text-green-400 text-xs">online</span>
              ) : (
                <span className="text-neutral-400 text-xs">offline</span>
              )}
            </div>

            {unseenmessages[user._id]>0 && (
              <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50">
                {unseenmessages[user._id]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leftsidebar;
