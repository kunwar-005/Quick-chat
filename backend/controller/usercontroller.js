import cloudinary from "../lib/cloudinary.js";
import { generatetoken } from "../lib/utils.js";
import User from "../model/user.js";
import bcrypt from "bcryptjs";



// signup function 
export const signup = async (req, res) => {
    const { fullname, email, password, bio } = req.body;
    try {
        if (!fullname || !email || !password || !bio) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ message: "User already exists" });

        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newuser = await User.create({
            fullname, email, password: hashedPassword, bio
        })
        const token = generatetoken(newuser._id);
        res.json({ success: true, token, userdata: newuser, message: "User registered successfully" });
    } catch (error) {
        console.error("Error in signup:", error);
        res.status(500).json({ message: error.message });
    }
}



// login function
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userdata = await User.findOne({ email });
        const ispasswordcorrect = await bcrypt.compare(password, userdata.password)
        if (!ispasswordcorrect) {
            return res.json({ success: false, message: "invalid credentials" })
        }
        const token = generatetoken(userdata._id);
        res.json({ success: true, token, userdata, message: "Login successful" });
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ message: error.message });
    }
}



// for authenticating user
export const checkauth = async (req, res) => {
    res.json({ success: true, userdata: req.user });
}


// for updating user profile
export const updateprofile = async (req, res) => {
  try {
    const { profilepic, bio, fullname } = req.body;
    const userId = req.user._id;
    let updatedUser;

    if (!profilepic) {
      // If no new image, just update text fields
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { bio, fullname },
        { new: true }
      );
    } else {
      // Upload new image to Cloudinary
      const upload = await cloudinary.uploader.upload(profilepic, {
        folder: "chat-app/profiles",
      });

      updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          profilepic: upload.secure_url,
          bio,
          fullname,
        },
        { new: true }
      );
    }

    res.json({
      success: true,
      userdata: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error in updateprofile:", error);
    res.status(500).json({ message: error.message });
  }
};

