const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema =new mongoose.Schema({
    email:{
        type:String,
        require:true,
        unique:true,
        trim:true,
        lowercase:true,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            ,"invalid email"
        ]
    },
    name:{
        type:String,
        required:[true,"Name is required for creating an accoutn"]
    },
    password:{
        type:String,
        required:[true,"Password is required for creating an accoutn"],
        minlength:[6,"password should contain more that 6 charcter"],
        select:false
    }
},{
    timestamps:true
})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next()
    }
    const hash = await bcrypt.hash(this.password,10)
    this.password = hash
    return next()
})

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password,this.password)
}

const UserModel = mongoose.model("User",userSchema)
module.exports=UserModel