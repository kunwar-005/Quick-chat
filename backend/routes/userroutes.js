
import express from "express";
import { protectroutes } from "../middleware/auth.js";
import { checkauth, login, signup, updateprofile } from "../controller/usercontroller.js";
const userrouter= express.Router()

userrouter.post("/signup",signup)
userrouter.post('/login',login)
userrouter.put('/update-profile',protectroutes,updateprofile)
userrouter.get('/check',protectroutes,checkauth)

export default userrouter;