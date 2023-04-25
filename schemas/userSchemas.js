const mongoose = require('mongoose');
const validator = require('validator');


let userSchema = new mongoose.Schema(
    {
        name:{type:String, required: true},
        email:{
            type:String,
            required:true,
            lowerCase:true,
            validate:(value)=>{
            return validator.isEmail(value)
        }
    },
        mobile:{type:String,default:'000-000-0000'},
        password:{type:String,required:true},
        role:{type:String,default:'user'},
        createAt:{type:Date,default:Date.now}
    },{
        collection: 'user',
        versionKey:false
    }
)


let userModel = mongoose.model('user',userSchema)
module.exports={userModel}