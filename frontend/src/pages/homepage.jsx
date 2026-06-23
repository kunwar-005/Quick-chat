import React, { useContext, useState } from 'react'
import Leftsidebar from '../components/leftsidebar'
import Chatcontainer from '../components/chatcontainer'
import Rightside from '../components/rightside'
import { Chatcontext } from '../../context/chatcontext'

const Homepage = () => {
  
  const{selecteduser}= useContext(Chatcontext)
  return (
    <div className=' border w-full h-screen sm:px-[15%] sm:py-[5%]'>
     <div className={ `backdrop-blur-xl border-2 border-gray-600 rounded-2x1
overflow-hidden h-full grid grid-cols-1 relative ${selecteduser ?
'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]' : 'md:grid-cols-2'}` }>
      <Leftsidebar/>
      <Chatcontainer/>
      <Rightside/>
     </div>
    </div>
  )
}

export default Homepage
