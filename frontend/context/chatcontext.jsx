import { useContext, useEffect, useState } from "react";
import { Children, createContext } from "react";
import { Authcontext } from "./authcontext";
import toast from 'react-hot-toast'

export const Chatcontext = createContext()

export const Chatprovider = ({children})=>{
    const [messages,setmessages]=  useState([])
    const [users,setusers]= useState([])
    const [selecteduser,setselecteduser]= useState(null)
    const [unseenmessages,setunseenmessages]= useState({})
    const {socket,axios,authUser}=useContext(Authcontext)

    // function to get all users 

    const getusers= async()=>{
        if(!authUser) return; // Don't fetch if user is not authenticated
        try {
            const{data}= await axios.get("/api/messages/user")
            if(data.success){
                setusers(data.users)
                setunseenmessages(data.unseenmessages)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // function to get messages for selected user

    const getmessage=async(userId)=>{
        try {
            const{data}= await axios.get(`/api/messages/${userId}`)
            if(data.success){
                setmessages(data.messages)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // functoin to send message to a selected user 
    const sendmessage=async(messagedata)=>{
        try {
            const {data}= await axios.post(`/api/messages/send/${selecteduser._id}`,messagedata)
            if(data.success){
                setmessages((prev)=>[...prev,data.newmessage])
            }
            else{
                toast.error(data.message)

            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // function to subscribe to selected user's message
    const subscribetomessages = async ()=>{
        if(!socket) return ;
        socket.on("newmessage",(newmessage)=>{
            if(selecteduser && newmessage.senderId===selecteduser._id){
                newmessage.seen= true
                setmessages((prev)=>[...prev,newmessage])
                axios.put(`/api/messages/mark/${newmessage._id}`)

            }
            else{
                setunseenmessages((prev)=>({
                    ...prev,[newmessage.senderId]:prev[newmessage.senderId]?prev[newmessage.senderId]+1:1
                }))
            }
        })
    }
    // function to unsubscribe to message
    const unsubscribetomessage=async()=>{
        if(socket) socket.off("newmessage")
    }
useEffect(()=>{
    subscribetomessages()
    return ()=>unsubscribetomessage();
},[socket,selecteduser])

    const value={
        messages,users,selecteduser,getusers,setmessages,sendmessage,setselecteduser,unseenmessages,setunseenmessages,getmessage
    }

    return (
        <Chatcontext.Provider value={value}>
            {children}
        </Chatcontext.Provider>
    )
}