require('dotenv').config()
const express = require("express");
const route = express.Router();

const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const Users = require("../model/user");
const Movie = require("../model/movie");

const mongoose = require("mongoose");
const verifyToken=require("../middleware/tokenVerify");

// -----user get data------------- 
route.get('/fetch',verifyToken,(req,res,next)=>{

    const role = req.role;
  if (role == "admin" || role == "user"){
    Users.find()
    .then(result=>{
        res.status(200).json({
            usersData:result
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
  }
  
});


// sort by asending
route.get('/sort/asending',verifyToken,async (req,res,next)=>{
    Movie.find({}).sort({releseDate:1})

    // Movie.aggregate ( { $sort: { releseDate : -1  } } )
    .then(result => {
        // return res.send("HELLLO")
        res.status(200).json({
            shortData:result
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
});
// sort by desending.
route.get('/sort/desending',verifyToken,async (req,res,next)=>{
    Movie.find({}).sort({releseDate:-1})

    .then(result => {
        // return res.send("HELLLO")
        res.status(200).json({
            shortData:result
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
});



//-------user can seen available movie.------------.


route.get('/sort/available',verifyToken, (req,res,next)=>{
    Movie.find({}).sort({releseDate:1})
    .then(result=>{
        res.status(200).json({
            AvaMovie:result
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
});

// --------------------sort movie by genre-----------------

route.get('/sort/genre/:genre', async (req,res,next)=>{
    console.log(req.params.genre);
    Movie.find({genre:req.params.genre}).sort({releseDate:1})
    .then(result=>{
        return res.status(200).json({
            movieGenre:result
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })


})

// -----------------------loginuser-----------------
route.post('/userLogin',async (req,res)=>{
    try{

        const {email,password} = req.body;
        
        if(!email){

            return res.send({message:" Enter Email"})
        }else if(!password){

          return res.send({message:" Enter Password"})
      }
        const user = await Users.findOne({email});
        if (user && (await bcrypt.compare(password, user.password))) {
                            // Token create        // 
            // const token = jwt.sign(
            //   { user_id: user._id, user_role: user.role },
            //   process.env.TOKEN_KEY,
            //   { 
            //     expiresIn: "4h",
            //   }
            // );
            const token = jwt.sign({
                user_id:user._id,
                user_role: user.role }, process.env.TOKEN_KEY,
                 {expiresIn : '24h'},
                 );
              return res.status(200).send({message:"valid" , token:token});
          }
        else{
             res.status(400).send({message:"Invalid "});
        }
        } catch (err) {
          console.log(err);
        }
      });


// ------signup user--------------------
route.post('/userSignup', (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({
                error: err
            })
        }
        else {
            const user = new Users({
                _id: new mongoose.Types.ObjectId,
                userName: req.body.userName,
                email: req.body.email,
                password: hash,
                age: req.body.age,
                phone:req.body.phone
            })
            user.save()
                .then(result => {
                    res.status(200).json({
                        newUser: result
                    })
                })
                .catch(err => {
                    if (err.code === 11000) {
                        return res.status(500).json({error: "Email already exist"})
                    }
                    return res.status(500).json({
                        error: err.message
                        
                    })
                })
        }
    })
});
// User rent movie

route.get('/rentMovie',verifyToken,async (req,res,next)=>{
    console.log(req.user)
   await Movie.find({rent:req.params.rent})
    .then(result=>{
        res.status(200).json({
            result:result
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
})





module.exports = route;