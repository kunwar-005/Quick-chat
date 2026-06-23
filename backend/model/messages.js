import mongoose from "mongoose";
const messageschema = new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    reciverId:{
         type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    text:{
        type:String,
    },
    image:{
        type:String,
    },
    seen:{
        type:Boolean,
        default:false}    

} ,{timestamps:true})

const Message=mongoose.model("messages",messageschema)
export default Message;