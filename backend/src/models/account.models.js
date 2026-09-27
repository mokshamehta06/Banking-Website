const mongoose = require("mongoose")


const accountSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required:[true],
        index:true
    },
    status:{
        type: String,
        enum: ["ACTIVE", "FROZEN", "CLOSED"],
        default: "ACTIVE"
    },
    currency:{
        type:String,
        required:[true],
        default:"INR"
    },
  
},{
    timestamps:true
})

accountSchema.index({user:1,status:1})
const accountModel = mongoose.model("account",accountSchema);
module.exports=accountModel