import React ,{useRef,useEffect, useContext, useState} from 'react'
import assets, { messagesDummyData } from '../assets/assets'
import { converttime } from '../lib/utils'
import { Chatcontext } from '../../context/chatcontext'
import { Authcontext } from '../../context/authcontext'
import toast from 'react-hot-toast'


const Chatcontainer = () => {
  const{messages,setselecteduser,selecteduser,sendmessage,getmessage}= useContext(Chatcontext)
  const{authUser,onlineusers}= useContext(Authcontext)
    const scrollend= useRef();

    const[input,setinput]= useState('')

    // handle sending message
    const handlesendmessage=async(e)=>{
      e.preventDefault()
      if(input.trim()==="") return null;
      await sendmessage({text: input.trim()})
      setinput("")
    }

    // handle sending image

    const handlesendimage= async(e)=>{
      const file= e.target.files[0];
      if(!file||!file.type.startsWith('image/')){
        toast.error("select an image ")
        return;
      }
      const reader= new FileReader();
      reader.onloadend= async()=>{
        await sendmessage({image:reader.result})
        e.target.value=""
      }
      reader.readAsDataURL(file)
    }
    useEffect(() => {
      if(selecteduser){
        getmessage(selecteduser._id)
      }
    
      
    }, [selecteduser])
    
    useEffect(() => {
        if (scrollend.current) {
            scrollend.current.scrollIntoView({ behavior: 'smooth' , block: 'end'});
        }
    }, [messages]);
  return selecteduser? (
    <div className='h-full overflow-scroll relative backdrop-blur-1g'>
      <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500' >
        <img src={selecteduser.profilepic||assets.avatar_icon} alt="" className="w-8 rounded-full"/>
        <p className='flex-1 text-lg text-white flex items-center gap-2'>
            {selecteduser.fullname}
           {onlineusers.includes(selecteduser._id) && <span className="w-2 h-2 rounded-full bg-green-500"></span>}
        </p>
        <img onClick={()=>setselecteduser(null)} src={assets.arrow_icon} alt=""className=' max-w-7'  />
        <img src={assets.help_icon} alt="" className='max-md:hidden max-w-5' />
      </div>


      {/* chat area */}

          <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>
              {messages.map((msg, index) => (
                  <div key={index} className={` flex items-end gap-2 justify-end ${msg.
                      senderId !== authUser._id && 'flex-row-reverse'} `}>
                      {msg.image ? (
                          <img src={msg.image} alt="" className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8'/>
                      ) : (<p className={`p-2 max-w-[200px] md:text-sm font-light rounded-1g mb-8 break-all bg-violet-500/30 text-white ${msg.senderId === authUser._id ?'rounded-br-none' :
                              'rounded-bl-none'}`} >{msg.text}</p>)}
                <div className="text-center text-xs">
                    <img src={msg.senderId===authUser._id? authUser?.profilepic|| assets.avatar_icon: selecteduser?.profilepic|| assets.avatar_icon} alt="" className='w-7 rounded-full'  />
                    <p className='text-gray-500'>{converttime(msg.createdAt)}</p>
                </div>
            </div>
        ))}
        <div ref={scrollend}></div>
      </div>


      {/* send chat area */}

          <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3'>
              <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full'>
                  <input onChange={(e)=>{setinput(e.target.value)}} value={input} onKeyDown={(e)=>e.key==="Enter"?handlesendmessage(e):null} type="text" placeholder='send chat ' className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400'/>
                  <label htmlFor="image">
                    <img src={assets.gallery_icon} alt="" className="w-5 mr-2 cursor-pointer"/>
                    </label>
                  <input onChange={handlesendimage} type="file" id="image" accept='image/png, image/jpeg' hidden />
                
              </div>
              <img onClick={handlesendmessage} src={assets.send_button} alt="" className="w-7 cursor-pointer" />
      </div>

    </div>
  ): (
    <div className='flex flex-col items-center justify-center gap-2 text-gray-500
bg-white/10 max-md:hidden rounded-l-xl '>
        <img src={assets.logo_icon} className='max-w-16' alt="" />
        <p className='text-lg font-medium text-white'>
            chat anytime anywhere
        </p>
    </div>
  )
}

export default Chatcontainer
