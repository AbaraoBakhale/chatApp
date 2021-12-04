
const mongoose=require('mongoose');


const rentMovie=new mongoose.Schema({

    user_id :{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users"
    },
   
    movie_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Movie"
    },
    movie_qty:{
        type:Number
    },
  
    

})
module.exports=mongoose.model('rentMovie',rentMovie);