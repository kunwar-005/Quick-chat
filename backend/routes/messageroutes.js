import express from "express"
import { protectroutes } from "../middleware/auth.js"
import { getmessages, getusersforsidebar, markmsgseen, sendmessage } from "../controller/messagecontroller.js"
const messagerouter = express.Router()

messagerouter.get("/user",protectroutes,getusersforsidebar)
messagerouter.get("/:id",protectroutes,getmessages)
messagerouter.get("mark/:id",protectroutes,markmsgseen)
messagerouter.post("/send/:id",protectroutes,sendmessage)
export default messagerouter;
