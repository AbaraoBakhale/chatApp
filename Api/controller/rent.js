const express = require("express");
const route = express.Router();
const rent_movie = require("../model/rent");
const movieModel = require("../model/movie");
const Users=require("../model/user")
const verifyToken=require("../middleware/tokenVerify");


route.post("/rentMovie", verifyToken, async function (req, res) {
    const role = req.role;
    console.log("....",req.user)
    if (role == "admin" || role == "user") {
      const {  movie_id, movie_qty } = req.body;
      user_id=req.user
     console.log(user_id)
      movieModel.findOne( { movie_qty: movie_qty });
  
      try {
        if (!user_id && !movie_id && !movie_qty) {
          res.send(" required!!");
        }
  
        const rentData = await rent_movie.create({
          user_id,
          movie_id,
          movie_qty,
        });
  
        movieQty = await movieModel.findOne({ _id: movie_id });
  
        remMovie = movieQty.movie_qty - movie_qty;
        if (remMovie <= 0) {
          res.send("Movie is not available");
        }
      
  
        update_qty = await movieModel.findOneAndUpdate(
            { _id: movie_id },
            { movie_qty:remMovie  }
        );
  
        return res.status(200).send({ data: rentData });
      } catch (err) {
        return res.status(500).send({ status: "error", message: err.message });
      }
    } 
  });

  
module.exports = route;