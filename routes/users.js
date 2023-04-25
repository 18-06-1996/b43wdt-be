const express = require('express');
const router = express.Router();
const {userModel} = require('../schemas/userSchemas');
const mongoose = require ('mongoose');
const {dbUrl} = require('../common/dbconfig');
const { hashPassword, hashCompare, createToken, validate,roleAdminGaurd } = require('../common/auth');
const { token } = require('morgan');

mongoose.connect(dbUrl);

router.post('/sign', async(req,res)=>{
  try {
    let user= await userModel.findOne({email:req.body.email})
   if(!user){

    let hashedPassword = await hashPassword(req.body.password)
req.body.password = hashedPassword
    let users = await userModel.create(req.body) 
    res.status(201).send({Message:"user signup successful"})
   }else{
    res.status(400).send({Message:"user already available here"})
   }
  } catch (error) {
    res.status(500).send({
    
      Message:"internal server error"
    })
  }
  
})


router.post('/login', async(req,res)=>{
  try {
    let user= await userModel.findOne({email:req.body.email})
   if(user){
    // verify password
     if(await hashCompare(req.body.password,user.password)){
      //create a token

let token = await createToken({
  name:user.name,
  email:user.email,
  id:user._id,
  role:user.role
})

      res.status(201).send({Message:"user Login successful", token})
       
    }else{
      res.status(402).send({Message:"Invalid credentials"})
     }
   }else{
    res.status(400).send({Message:"user dose not exists "})
   }
  } catch (error) {
    res.status(500).send({
    
      Message:"internal server error"
    })
  }
  
})


router.get("/", validate,roleAdminGaurd, async (req,res)=>{
  try {
    let users= await userModel.find()
    res.status(200).send({
      users,
      message:"user details here"})
  } catch (error) {
    res.status(500).send({message:"internal server error found"})
  }
})

router.get("/:id",async (req,res)=>{
  try {
    let users= await userModel.findOne({_id:req.params.id})
    res.status(200).send({
      users,
      message:"dser data fetch successfully"})
  } catch (error) {
    res.status(500).send({message:"internal server error found"})
  }
})


router.delete("/:id", async(req,res)=>{
  try {
    let user = await userModel.findOne({_id:req.params.id})
    if(user){
      let user = await userModel.deleteOne({_id:req.params.id})
      res.status(200).send({user,message:"user delete successfully"})
    }else{
      res.status(400).send({message:"data not exists"})
    }
  } catch (error) {
    res.status(500).send({message:"internal server error found"})
  
  }
})

router.put("/:id", async(req,res)=>{
  try {
    let user = await userModel.findOne({_id:req.params.id})
    if(user){
      user.name = req.body.name
      user.email = req.body.email
      user.password = req.body.password

      await user.save()


      res.status(200).send({user,message:"user updated successfully"})
    }else{
      res.status(400).send({message:"data not exists"})
    }
  } catch (error) {
    res.status(500).send({message:"internal server error found"})
  
  }
})




module.exports=router;














// var express = require('express');
// var router = express.Router();
// const {userModel} = require('../schemas/userSchemas');
// const mongoose = require('mongoose');
// const {dbUrl} = require('../common/dbconfig');
// const { hashPassword,hashCompare, createToken } = require('../common/auth');


// mongoose.connect(dbUrl);


// router.get('/',async(req,res,next)=>{
//   try {
//     let users= await userModel.find()
//     res.status(201).send({
//       users,
//       message:"users informations"
//     })
    
//   } catch (error) {
//     res.status(500).send({message:"internal server error"}),
//     error
//   }

// })

// router.get('/:id',async(req,res)=>{
//   try {
//     let user= await userModel.findOne({_id:req.params.id})
//     res.status(201).send({
//       user,
//       message:"users informations"
//     })
    
//   } catch (error) {
//     res.status(500).send({message:"internal server error"}),
//     error
//   }

// })


// router.delete('/:id',async(req,res)=>{
//   try {
//     let user = await UserModel.findOne({_id:req.params.id})
//     if(user)
//     {
//       let user = await UserModel.deleteOne({_id:req.params.id})
//       res.status(200).send({
//         message:"User Deleted Successfull!"
//       })
//     }
//     else
//     {
//       res.status(400).send({message:"User Does Not Exists!"})
//     }

//   } catch (error) {
//     res.status(500).send({message:"id dosen't exits"}),
//     error
//   }

// })


// router.put('/:id',async(req,res)=>{
//   try {
//     let users = await UserModel.findOne({_id:req.params.id})
//     if(users)
//     {
//       users.name = req.body.name
//       users.email = req.body.email
//       users.password = req.body.password

//       await users.save()

//       res.status(200).send({
//         message:"User Updated Successfully!"
//       })
//     }
//     else
//     {
//       res.status(400).send({message:"User Does Not Exists!"})
//     }

//   } catch (error) {
//     res.status(500).send({
//       message:"Internal Server Error",
//       error
//     })
//   }
// })



// router.post('/sign', async(req,res)=>{
//   try {
//      let user =await userModel.findOne({email:req.body.email})
//      if(user){
// if(await hashCompare(req.body.password,user.password)){
 
//   let token = await createToken({
//     name:user.name,
//     email:user.email,
//     id:user._id,
//     role:user.role

//   })
 
//     res.sendStatus(201).send({
//       message:"signup successfully"
//     })
//   }
//   else{
//       res.status(400).send({message:"invalid cadentails"})
//     }
//   }
//     else{
//       res.status(400).send({message:"user dosen't exits"})
//     }
//   }
//   catch (error) {
//     res.status(500).send({message:"internal server error"}),
//     error
//   }
// })

// module.exports = router;
