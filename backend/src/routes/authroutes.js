import express from "express";
const router = express.Router();
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.error("JWT_SECRET is missing from env!");
    }
    return jwt.sign({ userId }, secret, { expiresIn: "15d" });
};

router.post("/register", async (req, res) => {
    try {
        const { email, username, password } = req.body

        if (!email || !username || !password) {
            return res.status(400).json({ message: "all fields are requried" })
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "password should be atleast 6 characters" })
        }
        if (username.length < 3) {
            return res.status(400).json({ message: "username should be atleast 3 characters" })
        }
        //check if the user already exists
        const existingEmail = await User.findOne({ email })
        if (existingEmail) {
            return res.status(400).json({ message: "This email is already in use" })
        }
        const existingUser = await User.findOne({ username })
        if (existingUser) {
            return res.status(400).json({ message: "User already existed" })
        }
        // creating a new avatar
        const profileImage = `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}`
        const user = new User({
            email,
            password,
            username,
            // profileImage: "",
            profileImage: profileImage, // Use the generated avatar URL

        })
        
        await user.save();
        const token = generateToken(user._id)
        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                createdAt: user.createdAt,    
            },
        });

    } catch (error) {
        console.log("Error in register", error)
        res.status(500).json({ message: "internal server error" })
    }
})
router.post("/login", async (req, res) => {
    let user;  
    let token; 
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "all fields are required" });
        }

        // check if the user exists
        user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email me lafda" });
        }

        // compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "password me laafda" });
        }

        // generate token
        token = generateToken(user._id);
        res.status(200).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
            },
        });
    } catch (error) {
        console.error("🔥 Error in login route:", error.message);
        console.error(error); // log full stack
        return res.status(500).json({ message: "internal server error" });
    } finally {
        console.log("User exists:", user);
        // console.log("Generated token:", token);
    }
});

export default router;
