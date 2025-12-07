const express=require('express')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const User=require('../models/User')

const router=express.Router();

router.post('/register',  async (req , res, next)=>{
    try {
        const {name, email, password}=req.body;
    const userExist=await User.findOne({email})
    if(userExist){
        return res.status(400).json({message: "User Already Exist Please LogIn!"})
    }
    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password, salt)
    const newUser=new User({
        name,
        email,
        password:hashedPassword
    });

    await newUser.save();
    res.status(200).json({message: "Registration Successful Now Please Login"})
    } catch (error) {
        return res.status(500).send('Internal server Error', error)
    }
})

router.post('/login', async (req, res, next)=>{
    try {
        const {email, password}=req.body;
        const user=await User.findOne({email})
        if(!user){
            return res.status(401).json({message: "Invalid Email"})
        }
        const validPassword=await bcrypt.compare(password, user.password)
        if(!validPassword){
            return res.status(400).send({message:" Invalid Password"})
        }
         const token = jwt.sign(
        { _id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,  // set true in production (https)
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000 // 1 day
  }).json({ message: "Login successful" });
    } catch (error) {
        return res.status(500).send('Internal server Error', error)
    }
})

module.exports=router;
