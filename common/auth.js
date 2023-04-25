const bcrypt = require('bcryptjs');
const jwt = require ('jsonwebtoken');
const { token } = require('morgan');
const saltRounds=10;
// const secretkey = "jkhjkhuhh>dscjfdjgif"


const hashPassword = async(password)=>{

    let salt =await bcrypt.genSalt(saltRounds)
    let hashedPassword = await bcrypt.hash(password,salt)
    return hashedPassword
}

const hashCompare = async(password,hashPassword)=>{ 
return await bcrypt.compare(password,hashPassword)
}

const createToken = async(payload)=>{
    let token = await jwt.sign(payload,process.env.secretkey,{expiresIn:'2m'})
    return token

}

const validate = async (req,res,next)=>{
    console.log(req.headers.authorization)
    if(req.headers.authorization){
        let token = req.headers.authorization.split(" ")[1]
        let data = await jwt.decode(token)
        console.log(data.exp)
        console.log(+new Date()/1000);
        if(Math.floor((+new Date()/1000))< data.exp){
            next()
        }else{
            res.status(400).send({message:"Token Expired"})
        }
       
    }else{
        res.status(400).send({message:"Token Not Found"})
    }
}


const roleAdminGaurd = async (req,res,next)=>{
    console.log(req.headers.authorization)
    if(req.headers.authorization){
        let token = req.headers.authorization.split(" ")[1]
        let data = await jwt.decode(token)
        console.log(data.exp)
        console.log(+new Date()/1000);
        if(data.role === 'admin'){
            next()
        }else{
            res.status(400).send({message:"Only Admins Are Allowed"})
        }
       
    }else{
        res.status(400).send({message:"Token Not Found"})
    }
}



module.exports  = {hashPassword,hashCompare,createToken,validate,roleAdminGaurd}