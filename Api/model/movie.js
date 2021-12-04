
const mongoose=require('mongoose');


const movieSchema=new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,

    movieName :{
        type:String,
    },
   
    releseDate:{
        type:Number
    },
    genre:{
        type:String
    },
    rent:{
        type:Number
    },
   
    movie_qty:{
        type:Number
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user",
    }

})
module.exports=mongoose.model('Movie',movieSchema);