const express = require("express");
const route = express.Router();
const rentMovie=require("../model/rent");
const verifyToken=require("../middleware/tokenVerify");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");



const Movie = require("../model/movie");

const Users=require("../model/user");
const mongoose = require("mongoose");


route.get('/',verifyToken,(req,res,next)=>{
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
});


// ----***** Add Movie from admin ******-----------------------------
route.post('/addMovie',verifyToken, (req, res, next) => {
    const movie = new Movie({
        _id: new mongoose.Types.ObjectId,
        movieName: req.body.movieName,
        releseDate: req.body.releseDate,
        genre: req.body.genre,
        rent: req.body.rent,
        quantity:req.body.quantity


    })
    movie.save()
        .then(result => {
            console.log(result);
            res.status(200).json({
                Movie: result
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
});

// ------------------Update movie--------------------
route.put('/:id',verifyToken,(req,res,next)=>{
    Movie.findOneAndUpdate({_id:req.params.id},{
        $set:{
            movieName:req.body.movieName,
            releseDate:req.body.releseDate,
            genre:req.body.genre,
            rent:req.body.rent,
            movie_qty:req.body.movie_qty


        }
    })
    .then(result=>{
        res.status(200).json({
            msg:"Update Successfully",
            Updated_User:result
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
})

// -----------delete movie from admin-----------

route.delete('/:id',verifyToken,(req,res,next)=>[
    Movie.remove({_id:req.params.id})
    .then(result=>{
        res.status(200).json({
            msg:'data delete successfully',
            result:result
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
])



// ----------admin can login users----------
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
// pagination for movies
// _id

route.get('/page',(req,res,next)=>{
    let page =req.query.page;
    let limit=req.query.limit;
    const startIndex=(page - 1)*limit;
    const endIndex=page*limit;
    const resultUsers=Users.slice(startIndex,endIndex);
    res.json(resultUsers)
    // Users.find().select('_id').limit(5)
        Users.find().skip((page-1)*limit).select('_id').limit(limit)

    .then(result=>{
        res.status(200).json({
            userId:result
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
});

// username
route.get('/namePage',verifyToken,(req,res,next)=>{
    Users.find().select('userName')
    .then(result=>{
        res.status(200).json({
            userId:result
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
});



// admin can see which user rent which movie.


route.get('/userMovie',verifyToken,(req,res,next)=>{
   
    rentMovie.find().populate("user_id").populate("movie_id")
    .then(result=>{
        res.status(200).json({
            userId:result
        })
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({
            error:err
        })
    })
   
});



module.exports = route;