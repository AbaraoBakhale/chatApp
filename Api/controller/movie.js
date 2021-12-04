const express = require("express");
const route = express.Router();

const Movie = require("../model/movie");
const mongoose = require("mongoose");
const verifyToken=require("../middleware/tokenVerify");


// Add Movie
route.post('/addMovie', (req, res, next) => {
    const role = req.role;
    if (role == "admin"){
        const movie = new Movie({
            _id: new mongoose.Types.ObjectId,
            movieName: req.body.movieName,
            releseDate: req.body.releseDate,
            genre: req.body.genre,
            rent: req.body.rent,
            movie_qty:req.body.movie_qty
    
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
    }

    
});

route.get('/getmovies',verifyToken, async (req, res, next) => {

    movies = await Movie.find()

    res.send({ data: movies })

});


module.exports = route;