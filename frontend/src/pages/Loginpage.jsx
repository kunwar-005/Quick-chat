import React,{useContext, useState} from 'react'
import assets from '../assets/assets'
import { Authcontext } from '../../context/authcontext'

const Loginpage = () => {
  const [current, seTcurrent] = useState("signup")
  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")
  const [fullname, setfullname] = useState("")
  const [bio, setbio] = useState("")
  const[issubmitted, setissubmitted]= useState(false)

  const {login}= useContext(Authcontext)


  const onsubmithandler = (e) => {
    e.preventDefault();
    if (current === "signup" && !issubmitted) {
      // proceed to next step of signup
      setissubmitted(true);
      return
    }
    login(current==="signup"?"signup":"login",{fullname,email,password,bio})
  }

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
      
      <img src={assets.logo_big} className='w-[min(30vw,250px)]' alt="" />


      <form onSubmit={onsubmithandler} className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-1g' >
        <h2 className='font-medium text-2x1 flex justify-between items-center'>
          {current}
          {issubmitted && (<img src={assets.arrow_icon} alt="" onClick={()=>setissubmitted(false)} className='w-5 cursor-pointer'/>)}
          
        </h2>
        {current === "signup" && !issubmitted&&(
          <input type="text" placeholder='full name' required onChange={(e)=>setfullname(e.target.value)} className='p-2 border border-gray-500 rounded-md focus: outline-none' />
          )}
          {!issubmitted &&(
            <>

          <input type="text" placeholder='email' required onChange={(e)=>setemail(e.target.value)} className='p-2 border border-gray-500 rounded-md focus: outline-none' />
          
          <input type="text" placeholder='password' required onChange={(e)=>setpassword(e.target.value)} className='p-2 border border-gray-500 rounded-md focus: outline-none' />

            </>
          ) }
          {current === "signup" && issubmitted&&(
          <textarea onChange={(e) => setbio(e.target.value)} value={bio}
            rows={4} className='p-2 border border-gray-500 rounded-md focus:outline-none focus: ring-2 
            focus :ring-indigo-500' placeholder="provide a short bio ... " required> </textarea>
            )}
            <button type='submit' className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'>
                {current === "signup" ? "Create Account" : "Login Now"}
            </button>
        <div className='flex items-center gap-2 text-sm text-gray-500'>
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy .</p>
        </div>
            <div>
              {current === "signup" ? (
                <p className='text-sm text-gray-600' > alreafy a user <span onClick={()=>{seTcurrent("login"); setissubmitted(false)}} className='font-medium text-violet-500 cursor-pointer'>Login here</span></p>  
              ):(<p className='text-sm text-gray-600' > create an Account <span onClick={()=>{seTcurrent("signup")}} className='font-medium text-violet-500 cursor-pointer'>Click here</span></p>  )}
            </div>
      </form>
    </div>
  )
}

export default Loginpage
