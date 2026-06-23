import cloudinary from "../lib/cloudinary.js"
import Message from "../model/messages.js"
import User from "../model/user.js"
import {io, usersocketmap} from "../server.js"


export const getusersforsidebar = async (req, res) => {
    try {
        const userId = req.user._id
        const filteredusers = await User.find({ _id: { $ne: userId } }).select("-password")

        // count number of unseen msg
        const unseenmessages={}
        const promises= filteredusers.map(async(user)=>{
            const message= await Message.find({senderId:user._id,reciverId:userId, seen:false})
            if(message.length>0){
                unseenmessages[user._id]=message.length
            }
        })
        await Promise.all(promises)
        return res.json({success:true,users:filteredusers,unseenmessages})
} catch (error) {
return res.json({success:false,message: error.message})
}
}

// get messages for a selected user

export const getmessages= async(req,res)=>{
    try {
        const {id:selecteduserid}= req.params
        const myId = req.user._id
        const messages= await Message.find({
            $or:[
            {senderId:myId, reciverId:selecteduserid},
            {senderId:selecteduserid, reciverId:myId},
        ]})
        await Message.updateMany({senderId:selecteduserid,reciverId:myId},{seen:true})
        res.json({success: true,messages})

    } catch (error) {
        return res.json({success:false,message: error.message})
    }
}


// api to mark individual msg seen

export const markmsgseen=async(req,res)=>{
    try {
        const {id}= req.params
        await Message.findByIdAndUpdate(id,{seeen:true})
        res.json({success:true})
    } catch (error) {
        return res.json({success:false,message: error.message})
    }
}


// send message

export const sendmessage=async(req,res)=>{
    try {
        const {text,image}= req.body;
        const senderId= req.user._id;
        const reciverId= req.params.id;

        let messageData = {
            senderId,
            reciverId,
            text
        }

        if(image){
            const uploadresponse = await cloudinary.uploader.upload(image) 
            messageData.image = uploadresponse.secure_url
        }
        
        const newmessage = await Message.create(messageData)

        // emit new message to user socket

        const reciversocketId= usersocketmap[reciverId]
        if(reciversocketId){

            io.to(reciversocketId).emit("newmessage", newmessage)
        }

            res.json({success:true, newmessage})
    } catch (error) {
        return res.json({success:false,message: error.message})
    }
}