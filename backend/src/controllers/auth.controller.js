const userModel = require('../models/user.model')
const jwt= require('jsonwebtoken')


async function userRegisterController(req, res) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields (name, email, password) are required",
                status: "failed"
            });
        }

        const isExists = await userModel.findOne({ email });

        if (isExists) {
            return res.status(422).json({
                message: "User already exists",
                status: "failed"
            });
        }

        const user = await userModel.create({
            email,
            password,
            name
        });

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "3d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 3 * 24 * 60 * 60 * 1000
        });

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                _id: user._id,
                email: user.email,
                name: user.name
            },
            token
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error",
            status: "failed"
        });
    }
}


async function userLoginController(req,res) {
     
        const {email,password} = req.body;

        const user = await userModel.findOne({email}).select("+password")

        if(!user){
            return res.status(401).json({
                message:"Email or Password Is INVALID"
            })
        }

        const isValidPassword =await user.comparePassword(password)
        if(!isValidPassword){
            return res.status(401).json({
                message:"Email or Password Is INVALID"
            })
        }

        const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"3d"})

        res.cookie("token",token)

        return res.status(200).json({
            message:"Login successful",
            user:{
                _id:user._id,
                email:user.email,
                name:user.name
            }
        })
}

module.exports = { userRegisterController,userLoginController };
